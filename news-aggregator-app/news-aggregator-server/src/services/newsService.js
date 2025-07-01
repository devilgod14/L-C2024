const axios = require('axios');
const ExternalAPISource = require('../models/ExternalAPISource');
const Category = require('../models/Category');
const Article = require('../models/Article');
const BlockedKeywords = require('../models/BlockedKeywords');
const recommendationService = require('./recommendationService');

class NewsService {

   constructor() {
    this.categoryKeywords = {
      Technology: ['Apple', 'Google', 'Microsoft', 'AI', 'software', 'iPhone', 'app', 'data', 'startup'],
      Sports: ['NBA', 'NFL', 'FIFA', 'World Cup', 'player', 'score', 'game', 'match', 'stadium', 'champion'],
      Business: ['stock', 'market', 'earnings', 'finance', 'economy', 'company', 'invest', 'shares'],
      Entertainment: ['movie', 'music', 'album', 'celebrity', 'film', 'television', 'actor'],
    };
  }  

  _categorizeByKeywords(textToScan) {
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

  _normalizeArticle(article, sourceName) {
    const sourceKey = sourceName.trim();
    let normalized = {
      title: null, description: null, url: null, publishedAt: null, categoryName: null,
    };

    if (sourceKey === 'NewsAPI') {
      if (!article.title || !article.url || article.title === '[Removed]') return null;
      normalized.title = article.title;
      normalized.description = article.description || article.title;
      normalized.url = article.url;
      normalized.publishedAt = article.publishedAt;
      normalized.categoryName = 'Business';
    } else if (sourceKey === 'The News API') {
      if (!article.title || !article.url) return null;
      normalized.title = article.title;
      normalized.description = article.snippet || article.description || article.title;
      normalized.url = article.url;
      normalized.publishedAt = article.published_at;
      normalized.categoryName = article.categories.length > 0 ? article.categories[0] : 'General';
    } else {
      console.warn(`Unknown news source found: '${sourceKey}'. Assigning 'General' category.`);
      normalized.title = article.title;
      normalized.description = article.description || '';
      normalized.url = article.url;
      normalized.publishedAt = article.publishedAt || new Date();
      normalized.categoryName = 'General';
    }

    if (normalized.categoryName === 'General') {
      const combinedText = `${normalized.title} ${normalized.description}`;
      normalized.categoryName = this._categorizeByKeywords(combinedText);
    }

    if (!normalized.categoryName) {
      normalized.categoryName = 'General';
    }
    return normalized;
  }

   async _getBaseContentFilter() {
    const hiddenCategories = await Category.find({ isHidden: true }).select('_id');
    const hiddenCategoryIds = hiddenCategories.map(c => c._id);

    const blockedKeywords = await BlockedKeywords.find({});
    const keywordRegexs = blockedKeywords.map(kw => new RegExp(kw.keyword, 'i'));

    const filter = {
      isHidden: false, 
      categoryId: { $nin: hiddenCategoryIds },
    };

    if (keywordRegexs.length > 0) {
      filter.$nor = [
        { title: { $in: keywordRegexs } },
        { description: { $in: keywordRegexs } },
      ];
    }

    return filter;
  }

  async fetchAndStoreNews() {

    let newArticles = [] ;
    console.log('Starting news fetch process...');
    const activeSources = await ExternalAPISource.find({ status: 'Active' });
    if (!activeSources.length) {
      console.log('No active news sources found.');
      return;
    }

    let allNormalizedArticles = [];
    for (const source of activeSources) {
      const endpoints = {
        'NewsAPI': `https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=${source.apiKey}`,
        'The News API': `https://api.thenewsapi.com/v1/news/top?api_token=${source.apiKey}&locale=us&limit=3`,
      };
      const endpoint = endpoints[source.name];
      if (!endpoint) continue;
      try {
        const response = await axios.get(endpoint);
        const articles = source.name === 'NewsAPI' ? response.data.articles : response.data.data;
        for (const rawArticle of articles) {
          const normalizedArticle = this._normalizeArticle(rawArticle, source.name);
          if (normalizedArticle) {
            allNormalizedArticles.push({ ...normalizedArticle, sourceId: source._id });
          }
        }
        source.lastAccessed = new Date();
        await source.save();
      } catch (error) {
        console.error(`Error fetching from ${source.name}:`, error.message);
      }
    }

    const newArticleIds = [];
    for (const article of allNormalizedArticles) {
      try {
        const lowerCaseName = article.categoryName.trim().toLowerCase();
        const standardCategoryName = lowerCaseName.charAt(0).toUpperCase() + lowerCaseName.slice(1);
        const category = await Category.findOneAndUpdate(
          { name: { $regex: `^${standardCategoryName}$`, $options: 'i' } },
          { $set: { name: standardCategoryName } },
          { upsert: true, new: true }
        );
        const articleData = {
          title: article.title, description: article.description, url: article.url,
          publishedAt: article.publishedAt, categoryId: category._id, sourceId: article.sourceId,
        };
        const result = await Article.updateOne({ url: article.url }, { $setOnInsert: articleData }, { upsert: true });
        if (result.upsertedCount > 0) {
          newArticleIds.push(result.upsertedId);
        }
      } catch (error) {
        if (error.code !== 11000) {
          console.error('Error saving article to DB:', error.message);
        }
      }

     if (newArticleIds.length > 0) {
      console.log(`Found ${newArticleIds.length} new articles. Triggering notification engine.`);
        newArticles = await Article.find({ '_id': { $in: newArticleIds } }).populate('categoryId', 'name');
    }
    

    }
    
    console.log(`News fetch process complete. Saved ${newArticleIds.length} new articles.`);
    return newArticles;
  }

  async getHeadlines( { filters = {}, userId }) {
    const { category, startDate, endDate } = filters;
    const baseFilter = await this._getBaseContentFilter();
    let query = { ...baseFilter };

    if (category && category.toLowerCase() !== 'all') {
      const categoryDoc = await Category.findOne({
        name: { $regex: `^${category}$`, $options: 'i' },
      });

      if (categoryDoc) {
        query.categoryId = categoryDoc._id;
      } else {
        return [];
      }
    }

    if (startDate || endDate) {
      query.publishedAt = {};
      if (startDate) {
        query.publishedAt.$gte = new Date(startDate);
      }
      if (endDate) {
        let endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        query.publishedAt.$lte = endOfDay;
      }
    }

    const articles = await Article.find(query)
      .sort({ publishedAt: -1 }) 
      .populate('categoryId', 'name') 
      .populate('sourceId', 'name'); 

    const scoredArticles = await recommendationService.scoreArticlesForUser({ userId, articles });
    scoredArticles.sort((a, b) => b.relevanceScore - a.relevanceScore || new Date(b.publishedAt) - new Date(a.publishedAt));

    return scoredArticles;
  }

   async searchArticles( { filters = {}, userId } ) {
    const { query, startDate, endDate } = filters;

    if (!query) {
      return [];
    }

     const baseFilter = await this._getBaseContentFilter();

     let mongoQuery = { 
      ...baseFilter,
      $text: { $search: query } 
    };

    if (startDate || endDate) {
      mongoQuery.publishedAt = {};
      if (startDate) {
        mongoQuery.publishedAt.$gte = new Date(startDate);
      }
      if (endDate) {
        let endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        mongoQuery.publishedAt.$lte = endOfDay;
      }
    }

    let sortQuery = { publishedAt: -1 }; 
  
    const articles = await Article.find(mongoQuery)
      .sort(sortQuery)
      .populate('categoryId', 'name')
      .populate('sourceId', 'name');

    const scoredArticles = await recommendationService.scoreArticlesForUser({ userId, articles });
    scoredArticles.sort((a, b) => b.relevanceScore - a.relevanceScore || new Date(b.publishedAt) - new Date(a.publishedAt));
    
    return scoredArticles;
  }

}

module.exports = new NewsService();