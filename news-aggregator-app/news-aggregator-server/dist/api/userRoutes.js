"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userService_1 = __importDefault(require("../services/userService"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
class UserRoutes {
    router = (0, express_1.Router)();
    constructor() { this.initializeRoutes(); }
    initializeRoutes() {
        this.router.get('/me/saved-articles', authMiddleware_1.default.isAuthenticated, this.getSaved);
        this.router.post('/me/saved-articles', authMiddleware_1.default.isAuthenticated, this.saveArticle);
        this.router.delete('/me/saved-articles/:id', authMiddleware_1.default.isAuthenticated, this.deleteSaved);
    }
    getSaved = async (req, res, next) => {
        try {
            const articles = await userService_1.default.getSavedArticles(req.user.id);
            res.json(articles);
        }
        catch (error) {
            next(error);
        }
    };
    saveArticle = async (req, res, next) => {
        try {
            const { articleId } = req.body;
            const saved = await userService_1.default.saveArticle(req.user.id, articleId);
            res.status(201).json(saved);
        }
        catch (error) {
            next(error);
        }
    };
    deleteSaved = async (req, res, next) => {
        try {
            await userService_1.default.deleteSavedArticle(req.user.id, req.params.id);
            res.json({ message: 'Article removed from saved list' });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.default = UserRoutes;
