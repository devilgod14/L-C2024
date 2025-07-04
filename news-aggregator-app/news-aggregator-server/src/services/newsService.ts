import axios from 'axios';
import newsRepository from '../repositories/newsRepository';
import logger from '../config/logger';
import { IArticle, HeadlineFilters, SearchFilters, IArticleDocument } from '../types/news.types';
import recommendationService from './recommendationService';

class NewsService {
  private categoryKeywords: Record<string, string[]>;

  constructor() {
    this.categoryKeywords = {
      Technology: ['Apple', 'Google', 'Microsoft', 'AI', 'software', 'iPhone', 'app', 'data', 'startup'],
      Sports: ['NBA', 'NFL', 'FIFA', 'World Cup', 'player', 'score', 'game', 'match', 'stadium', 'champion'],
      Business: ['stock', 'market', 'earnings', 'finance', 'economy', 'company', 'invest', 'shares'],
      Entertainment: ['movie', 'music', 'album', 'celebrity', 'film', 'television', 'actor'],
    };
  }

  private _categorizeByKeywords(textToScan: string): string {
    const text = textToScan.toLowerCase();
    for (const category in this.categoryKeywords) {
      for (const keyword of this.categoryKeywords[category]) {
        if (text.includes(keyword.toLowerCase())) {
          return category;
        }
      }
    }
    return 'General';
  }

  private _normalizeArticle(article: any, sourceName: string): (Partial<IArticle> & { categoryName: string }) | null {
    const sourceKey = sourceName.trim();
    let normalized: Partial<IArticle> & { categoryName: string } = {
        title: '', description: '', url: '', publishedAt: new Date(), categoryName: 'General'
    };

    if (sourceKey === 'NewsAPI') {
      if (!article.title || !article.url || article.title === '[Removed]') return null;
      normalized.title = article.title;
      normalized.description = article.description || article.title;
      normalized.url = article.url;
      normalized.publishedAt = new Date(article.publishedAt);
      normalized.categoryName = 'Business';
    } else if (sourceKey === 'The News API') {
      if (!article.title || !article.url) return null;
      normalized.title = article.title;
      normalized.description = article.snippet || article.description || article.title;
      normalized.url = article.url;
      normalized.publishedAt = new Date(article.published_at);
      normalized.categoryName = article.categories.length > 0 ? article.categories[0] : 'General';
    } else {
        return null;
    }

    if (normalized.categoryName === 'General') {
        const combinedText = `${normalized.title} ${normalized.description}`;
        normalized.categoryName = this._categorizeByKeywords(combinedText);
    }
    return normalized;
  }
  
  private async _getBaseContentFilter(): Promise<any> {
    const hiddenCategoryIds = await newsRepository.findHiddenCategoryIds();
    const blockedKeywords = await newsRepository.findAllBlockedKeywords();
    const keywordRegexs = blockedKeywords.map(kw => new RegExp(kw, 'i'));

    const filter: any = {
      isHidden: false,
      categoryId: { $nin: hiddenCategoryIds },
    };

    if (keywordRegexs.length > 0) {
      filter.$nor = [ { title: { $in: keywordRegexs } }, { description: { $in: keywordRegexs } } ];
    }
    return filter;
  }

  public async getHeadlines({ filters, userId }: { filters: HeadlineFilters; userId: string; }) {
    const { category, startDate, endDate } = filters;
    const baseFilter = await this._getBaseContentFilter();
    let query: any = { ...baseFilter };

    if (category && category.toLowerCase() !== 'all') {
      const categoryDoc = await newsRepository.findCategoryByName(category);
      if (categoryDoc) query.categoryId = categoryDoc._id;
      else return [];
    }

    if (startDate || endDate) {
        query.publishedAt = {};
        if (startDate) query.publishedAt.$gte = new Date(startDate);
        if (endDate) {
          let endOfDay = new Date(endDate);
          endOfDay.setHours(23, 59, 59, 999);
          query.publishedAt.$lte = endOfDay;
        }
    }
    
    const articles = await newsRepository.findArticles(query);
    const scoredArticles = await recommendationService.scoreArticlesForUser({ userId, articles });
    scoredArticles.sort((a, b) => b.relevanceScore - a.relevanceScore || new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    return scoredArticles;
  }

  public async searchArticles({ filters, userId }: { filters: SearchFilters; userId: string; }) {
    const { query, startDate, endDate, sortBy } = filters;
    const baseFilter = await this._getBaseContentFilter();
    let mongoQuery: any = { ...baseFilter, $text: { $search: query } };
    
    if (startDate || endDate) {
        mongoQuery.publishedAt = {};
        if (startDate) mongoQuery.publishedAt.$gte = new Date(startDate);
        if (endDate) {
            let endOfDay = new Date(endDate);
            endOfDay.setHours(23, 59, 59, 999);
            mongoQuery.publishedAt.$lte = endOfDay;
        }
    }

    let sortQuery: any = { score: { $meta: "textScore" } };
    if (sortBy === 'likes' || sortBy === 'dislikes') {
        sortQuery = { [sortBy]: -1 };
    }
    
    const articles = await newsRepository.findArticles(mongoQuery, sortQuery);
    const scoredArticles = await recommendationService.scoreArticlesForUser({ userId, articles });
    scoredArticles.sort((a:any, b:any) => b.relevanceScore - a.relevanceScore || new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    return scoredArticles;
  }

  public async fetchAndStoreNews(): Promise<IArticleDocument[]> {
    logger.info('Starting news fetch process...');
    const activeSources = await newsRepository.findActiveSources();
    const newArticleIds: any[] = [];

    const endpoints: Record<string, (key: string) => string> = {
      'NewsAPI': (key) => `https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=${key}`,
      'The News API': (key) => `https://api.thenewsapi.com/v1/news/top?api_token=${key}&locale=us&limit=3`
    };

    for (const source of activeSources) {
      const endpointFn = endpoints[source.name];
      if (!endpointFn) continue;

      const url = endpointFn(source.apiKey);

      try {
        const response = await axios.get(url);
        const articles = source.name === 'NewsAPI' ? response.data.articles : response.data.data;
        
        for (const rawArticle of articles) {
            const normalizedArticle = this._normalizeArticle(rawArticle, source.name);
            if (normalizedArticle && normalizedArticle.url) {
                const category = await newsRepository.findOrCreateCategory(normalizedArticle.categoryName);
                const articleData: any = { ...normalizedArticle, categoryId: category._id, sourceId: source._id };
                const result = await newsRepository.updateArticleWithUpsert(articleData.url, articleData);
                if (result.upsertedCount > 0 && result.upsertedId) {
                    newArticleIds.push(result.upsertedId);
                }
            }
        }
      } catch (error) {
        logger.error(`Failed to fetch from ${source.name}`, { error });
      }
    }

    logger.info(`News fetch process complete. Saved ${newArticleIds.length} new articles.`);
    if (newArticleIds.length > 0) {
        return newsRepository.findArticles({ _id: { $in: newArticleIds } });
    }
    return [];
  }
}

export default new NewsService();