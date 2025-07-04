"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const articleService_1 = __importDefault(require("../services/articleService"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
class ArticleRoutes {
    router = (0, express_1.Router)();
    constructor() { this.initializeRoutes(); }
    initializeRoutes() {
        this.router.post('/:id/vote', authMiddleware_1.default.isAuthenticated, this.vote);
        this.router.post('/:id/read', authMiddleware_1.default.isAuthenticated, this.read);
        this.router.post('/:id/report', authMiddleware_1.default.isAuthenticated, this.report);
    }
    vote = async (req, res, next) => {
        try {
            const voteData = { userId: req.user.id, articleId: req.params.id, voteType: req.body.vote };
            const updatedArticle = await articleService_1.default.handleVote(voteData);
            res.json(updatedArticle);
        }
        catch (error) {
            next(error);
        }
    };
    read = async (req, res, next) => {
        try {
            const result = await articleService_1.default.logArticleRead({
                userId: req.user.id,
                articleId: req.params.id,
            });
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    };
    report = async (req, res, next) => {
        try {
            const result = await articleService_1.default.reportArticle({
                userId: req.user.id,
                articleId: req.params.id,
            });
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    };
}
exports.default = ArticleRoutes;
