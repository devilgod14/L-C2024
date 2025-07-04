"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SavedArticle_1 = __importDefault(require("../models/SavedArticle"));
class SavedArticleRepository {
    async findByUserId(userId) {
        return SavedArticle_1.default.find({ userId })
            .sort({ createdAt: -1 })
            .populate({
            path: 'articleId',
            populate: {
                path: 'categoryId sourceId',
                select: 'name'
            }
        });
    }
    async findOne(userId, articleId) {
        return SavedArticle_1.default.findOne({ userId, articleId });
    }
    async create(userId, articleId) {
        return SavedArticle_1.default.create({ userId, articleId });
    }
    async findById(id) {
        return SavedArticle_1.default.findById(id);
    }
    async deleteById(id) {
        return SavedArticle_1.default.findByIdAndDelete(id);
    }
}
exports.default = new SavedArticleRepository();
