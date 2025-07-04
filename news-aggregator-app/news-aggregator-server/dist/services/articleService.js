"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../config/logger"));
const Report_1 = __importDefault(require("../models/Report"));
const articleRepository_1 = __importDefault(require("../repositories/articleRepository"));
const readHistoryRepository_1 = __importDefault(require("../repositories/readHistoryRepository"));
const voteRepository_1 = __importDefault(require("../repositories/voteRepository"));
const error_1 = require("../utils/error");
class ArticleService {
    async handleVote({ userId, articleId, voteType }) {
        const article = await articleRepository_1.default.findById(articleId);
        if (!article)
            throw new error_1.NotFoundError('Article not found.');
        const existingVote = await voteRepository_1.default.findOne(userId, articleId);
        let likeChange = 0;
        let dislikeChange = 0;
        if (existingVote) {
            if (existingVote.vote === voteType) {
                await voteRepository_1.default.deleteOne(userId, articleId);
                if (voteType === 'like')
                    likeChange = -1;
                else
                    dislikeChange = -1;
            }
            else {
                if (voteType === 'like') {
                    likeChange = 1;
                    dislikeChange = -1;
                }
                else {
                    likeChange = -1;
                    dislikeChange = 1;
                }
                existingVote.vote = voteType;
                await existingVote.save();
            }
        }
        else {
            await voteRepository_1.default.create(userId, articleId, voteType);
            if (voteType === 'like')
                likeChange = 1;
            else
                dislikeChange = 1;
        }
        if (likeChange !== 0 || dislikeChange !== 0) {
            await articleRepository_1.default.updateVoteCounts(articleId, likeChange, dislikeChange);
        }
        return articleRepository_1.default.findById(articleId);
    }
    async logArticleRead({ userId, articleId }) {
        await readHistoryRepository_1.default.createOrFind(userId, articleId);
        return { message: 'Article read status logged.' };
    }
    async reportArticle({ userId, articleId }) {
        const article = await articleRepository_1.default.findById(articleId);
        if (!article)
            throw new error_1.NotFoundError('Article not found.');
        const existingReport = await Report_1.default.findOne({ userId, articleId });
        if (existingReport)
            throw new error_1.BadRequestError('You have already reported this article.');
        await Report_1.default.create({ userId, articleId });
        const updatedArticle = await articleRepository_1.default.incrementReportCount(articleId);
        const reportThreshold = parseInt(process.env.REPORT_THRESHOLD || '5', 10);
        if (updatedArticle && updatedArticle.reportCount >= reportThreshold) {
            updatedArticle.isHidden = true;
            await updatedArticle.save();
            logger_1.default.info(`Article ${articleId} automatically hidden due to report threshold.`);
        }
        return { message: 'Article reported successfully.' };
    }
}
exports.default = new ArticleService();
