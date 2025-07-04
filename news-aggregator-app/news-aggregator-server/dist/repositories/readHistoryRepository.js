"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReadHistory_1 = __importDefault(require("../models/ReadHistory"));
class ReadHistoryRepository {
    async createOrFind(userId, articleId) {
        return ReadHistory_1.default.findOneAndUpdate({ userId, articleId }, { $set: { userId, articleId } }, { upsert: true, new: true });
    }
    async findByUserId(userId) {
        return ReadHistory_1.default.find({ userId }).populate('articleId', 'categoryId');
    }
}
exports.default = new ReadHistoryRepository();
