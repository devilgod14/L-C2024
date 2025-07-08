"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const newsRepository_1 = __importDefault(require("../repositories/newsRepository"));
const logger_1 = __importDefault(require("../config/logger"));
const recommendationService_1 = __importDefault(require("./recommendationService"));
class NewsService {
    categoryKeywords;
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
            title: '', description: '', url: '', publishedAt: new Date(), categoryName: 'General'
        };
        if (sourceKey === 'NewsAPI') {
            if (!article.title || !article.url || article.title === '[Removed]')
                return null;
            normalized.title = article.title;
            normalized.description = article.description || article.title;
            normalized.url = article.url;
            normalized.publishedAt = new Date(article.publishedAt);
            normalized.categoryName = 'Business';
        }
        else if (sourceKey === 'The News API') {
            if (!article.title || !article.url)
                return null;
            normalized.title = article.title;
            normalized.description = article.snippet || article.description || article.title;
            normalized.url = article.url;
            normalized.publishedAt = new Date(article.published_at);
            normalized.categoryName = article.categories.length > 0 ? article.categories[0] : 'General';
        }
        else {
            return null;
        }
        if (normalized.categoryName === 'General') {
            const combinedText = `${normalized.title} ${normalized.description}`;
            normalized.categoryName = this._categorizeByKeywords(combinedText);
        }
        return normalized;
    }
    async _getBaseContentFilter() {
        const hiddenCategoryIds = await newsRepository_1.default.findHiddenCategoryIds();
        const blockedKeywords = await newsRepository_1.default.findAllBlockedKeywords();
        const keywordRegexs = blockedKeywords.map(kw => new RegExp(kw, 'i'));
        const filter = {
            isHidden: false,
            categoryId: { $nin: hiddenCategoryIds },
        };
        if (keywordRegexs.length > 0) {
            filter.$nor = [{ title: { $in: keywordRegexs } }, { description: { $in: keywordRegexs } }];
        }
        return filter;
    }
    async getHeadlines({ filters, userId }) {
        const { category, startDate, endDate } = filters;
        const baseFilter = await this._getBaseContentFilter();
        let query = { ...baseFilter };
        if (category && category.toLowerCase() !== 'all') {
            const categoryDoc = await newsRepository_1.default.findCategoryByName(category);
            if (categoryDoc)
                query.categoryId = categoryDoc._id;
            else
                return [];
        }
        if (startDate || endDate) {
            query.publishedAt = {};
            if (startDate)
                query.publishedAt.$gte = new Date(startDate);
            if (endDate) {
                let endOfDay = new Date(endDate);
                endOfDay.setHours(23, 59, 59, 999);
                query.publishedAt.$lte = endOfDay;
            }
        }
        const articles = await newsRepository_1.default.findArticles(query);
        const scoredArticles = await recommendationService_1.default.scoreArticlesForUser({ userId, articles });
        scoredArticles.sort((a, b) => b.relevanceScore - a.relevanceScore || new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        return scoredArticles;
    }
    async searchArticles({ filters, userId }) {
        const { query, startDate, endDate, sortBy } = filters;
        const baseFilter = await this._getBaseContentFilter();
        let mongoQuery = { ...baseFilter, $text: { $search: query } };
        if (startDate || endDate) {
            mongoQuery.publishedAt = {};
            if (startDate)
                mongoQuery.publishedAt.$gte = new Date(startDate);
            if (endDate) {
                let endOfDay = new Date(endDate);
                endOfDay.setHours(23, 59, 59, 999);
                mongoQuery.publishedAt.$lte = endOfDay;
            }
        }
        let sortQuery = { score: { $meta: "textScore" } };
        if (sortBy === 'likes' || sortBy === 'dislikes') {
            sortQuery = { [sortBy]: -1 };
        }
        const articles = await newsRepository_1.default.findArticles(mongoQuery, sortQuery);
        const scoredArticles = await recommendationService_1.default.scoreArticlesForUser({ userId, articles });
        scoredArticles.sort((a, b) => b.relevanceScore - a.relevanceScore || new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        return scoredArticles;
    }
    async fetchAndStoreNews() {
        logger_1.default.info('Starting news fetch process...');
        const activeSources = await newsRepository_1.default.findActiveSources();
        const newArticleIds = [];
        const endpoints = {
            'NewsAPI': (key) => `https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=${key}`,
            'The News API': (key) => `https://api.thenewsapi.com/v1/news/top?api_token=${key}&locale=us&limit=3`
        };
        for (const source of activeSources) {
            const endpointFn = endpoints[source.name];
            if (!endpointFn)
                continue;
            const url = endpointFn(source.apiKey);
            try {
                const response = await axios_1.default.get(url);
                const articles = source.name === 'NewsAPI' ? response.data.articles : response.data.data;
                for (const rawArticle of articles) {
                    const normalizedArticle = this._normalizeArticle(rawArticle, source.name);
                    if (normalizedArticle && normalizedArticle.url) {
                        const category = await newsRepository_1.default.findOrCreateCategory(normalizedArticle.categoryName);
                        const articleData = { ...normalizedArticle, categoryId: category._id, sourceId: source._id };
                        const result = await newsRepository_1.default.updateArticleWithUpsert(articleData.url, articleData);
                        if (result.upsertedCount > 0 && result.upsertedId) {
                            newArticleIds.push(result.upsertedId);
                        }
                    }
                }
            }
            catch (error) {
                logger_1.default.error(`Failed to fetch from ${source.name}`, { error });
            }
        }
        logger_1.default.info(`News fetch process complete. Saved ${newArticleIds.length} new articles.`);
        if (newArticleIds.length > 0) {
            return newsRepository_1.default.findArticles({ _id: { $in: newArticleIds } });
        }
        return [];
    }
}
exports.default = new NewsService();
