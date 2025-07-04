"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const savedArticleRepository_1 = __importDefault(require("../repositories/savedArticleRepository"));
const articleRepository_1 = __importDefault(require("../repositories/articleRepository"));
const error_1 = require("../utils/error");
class UserService {
    async getSavedArticles(userId) {
        return savedArticleRepository_1.default.findByUserId(userId);
    }
    async saveArticle(userId, articleId) {
        const article = await articleRepository_1.default.findById(articleId);
        if (!article)
            throw new error_1.NotFoundError('Article not found.');
        const existingSave = await savedArticleRepository_1.default.findOne(userId, articleId);
        if (existingSave)
            throw new error_1.BadRequestError('Article has already been saved.');
        return savedArticleRepository_1.default.create(userId, articleId);
    }
    async deleteSavedArticle(userId, savedArticleId) {
        const savedArticle = await savedArticleRepository_1.default.findById(savedArticleId);
        if (!savedArticle)
            throw new error_1.NotFoundError('Saved article entry not found.');
        if (savedArticle.userId.toString() !== userId) {
            throw new error_1.UnauthorizedError('User not authorized to delete this.');
        }
        return savedArticleRepository_1.default.deleteById(savedArticleId);
    }
}
exports.default = new UserService();
