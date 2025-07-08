"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const voteRepository_1 = __importDefault(require("../repositories/voteRepository"));
const savedArticleRepository_1 = __importDefault(require("../repositories/savedArticleRepository"));
const readHistoryRepository_1 = __importDefault(require("../repositories/readHistoryRepository"));
const notificationRepository_1 = __importDefault(require("../repositories/notificationRepository"));
class RecommendationService {
    weights = {
        SAVED_CATEGORY: 15,
        LIKED_CATEGORY: 10,
        READ_CATEGORY: 5,
        NOTIFICATION_CATEGORY: 20,
        NOTIFICATION_KEYWORD: 25,
    };
    async scoreArticlesForUser({ userId, articles }) {
        if (!userId || !articles || articles.length === 0) {
            return articles.map(a => ({ ...a.toObject(), relevanceScore: 0 }));
        }
        const [settings, likedVotes, saved, readHistory] = await Promise.all([
            notificationRepository_1.default.findSettingsForUser(userId),
            voteRepository_1.default.findAllByUserId(userId, 'like'),
            savedArticleRepository_1.default.findByUserId(userId),
            readHistoryRepository_1.default.findByUserId(userId),
        ]);
        const categoryInterest = {};
        const addInterest = (categoryId, weight) => {
            if (!categoryId)
                return;
            const id = categoryId.toString();
            categoryInterest[id] = (categoryInterest[id] || 0) + weight;
        };
        likedVotes.forEach((vote) => addInterest(vote.articleId?.categoryId, this.weights.LIKED_CATEGORY));
        saved.forEach((item) => addInterest(item.articleId?.categoryId, this.weights.SAVED_CATEGORY));
        readHistory.forEach((item) => addInterest(item.articleId?.categoryId, this.weights.READ_CATEGORY));
        const notificationKeywords = settings?.keywords || [];
        const notificationCategories = settings?.enabledCategories || [];
        const scoredArticles = articles.map(article => {
            let relevanceScore = 0;
            const articleText = `${article.title} ${article.description}`.toLowerCase();
            const articleCategoryId = article.categoryId._id.toString();
            const articleCategoryName = article.categoryId.name;
            if (notificationCategories.includes(articleCategoryName)) {
                relevanceScore += this.weights.NOTIFICATION_CATEGORY;
            }
            notificationKeywords.forEach((keyword) => {
                if (articleText.includes(keyword.toLowerCase())) {
                    relevanceScore += this.weights.NOTIFICATION_KEYWORD;
                }
            });
            if (categoryInterest[articleCategoryId]) {
                relevanceScore += categoryInterest[articleCategoryId];
            }
            return { ...article.toObject(), relevanceScore };
        });
        return scoredArticles;
    }
}
exports.default = new RecommendationService();
