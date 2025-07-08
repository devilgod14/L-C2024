"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vote_1 = __importDefault(require("../models/Vote"));
class VoteRepository {
    async findOne(userId, articleId) {
        return Vote_1.default.findOne({ userId, articleId });
    }
    async create(userId, articleId, voteType) {
        return Vote_1.default.create({ userId, articleId, vote: voteType });
    }
    async deleteOne(userId, articleId) {
        return Vote_1.default.deleteOne({ userId, articleId });
    }
    async findAllByUserId(userId, voteType) {
        return Vote_1.default.find({ userId, vote: voteType }).populate('articleId', 'categoryId');
    }
}
exports.default = new VoteRepository();
