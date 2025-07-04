"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Article_1 = __importDefault(require("../models/Article"));
class ArticleRepository {
    async findById(id) {
        return Article_1.default.findById(id);
    }
    async updateVoteCounts(articleId, likeChange, dislikeChange) {
        return Article_1.default.updateOne({ _id: articleId }, { $inc: { likes: likeChange, dislikes: dislikeChange } });
    }
    async incrementReportCount(articleId) {
        return Article_1.default.findByIdAndUpdate(articleId, { $inc: { reportCount: 1 } }, { new: true });
    }
}
exports.default = new ArticleRepository();
