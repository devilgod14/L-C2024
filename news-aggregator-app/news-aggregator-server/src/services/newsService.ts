import axios from 'axios';
import newsRepository from '../repositories/newsRepository';
import logger from '../config/logger';
import { IArticle, HeadlineFilters, SearchFilters, IArticleDocument } from '../types/news.types';
import recommendationService from './recommendationService';
import { INewsApiStrategy } from './api-strategies/INewsApiStrategy';
import { NewsApiStrategy } from './api-strategies/NewsApiStrategy';
import { TheNewsApiStrategy } from './api-strategies/TheNewsApiStrategy';

class NewsService {
  private categoryKeywords: Record<string, string[]>;
  private strategies: Map<string, INewsApiStrategy>;

  constructor() {
    this.categoryKeywords = {
      Technology: ['Apple', 'Google', 'Microsoft', 'AI', 'software', 'iPhone', 'app', 'data', 'startup'],
      Sports: ['NBA', 'NFL', 'FIFA', 'World Cup', 'player', 'score', 'game', 'match', 'stadium', 'champion'],
      Business: ['stock', 'market', 'earnings', 'finance', 'economy', 'company', 'invest', 'shares'],
      Entertainment: ['movie', 'music', 'album', 'celebrity', 'film', 'television', 'actor'],
    };
    this.strategies = new Map();
    this.strategies.set('NewsAPI', new NewsApiStrategy());
    this.strategies.set('The News API', new TheNewsApiStrategy());
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

    for (const source of activeSources) {
      const strategy = this.strategies.get(source.name);
      if (!strategy) {
        logger.warn(`No strategy found for source: ${source.name}`);
        continue;
      }

      const url = strategy.buildUrl(source);
      try {
        const response = await axios.get(url);
        const articles = source.name === 'NewsAPI' ? response.data.articles : response.data.data;

        for (const rawArticle of articles) {
          let normalizedArticle = strategy.normalizeResponse(rawArticle);
          if (normalizedArticle && normalizedArticle.url) {
            if (normalizedArticle.categoryName === 'General') {
              const combinedText = `${normalizedArticle.title} ${normalizedArticle.description}`;
              normalizedArticle.categoryName = this._categorizeByKeywords(combinedText);
            }

            const category = await newsRepository.findOrCreateCategory(normalizedArticle.categoryName);
            const articleData: Partial<IArticle> = { ...normalizedArticle, categoryId: category._id as any, sourceId: source._id as any };
            const result = await newsRepository.updateArticleWithUpsert(articleData.url as any, articleData);
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