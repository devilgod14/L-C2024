"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const newsService_1 = __importDefault(require("../services/newsService"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
class NewsRoutes {
    router = (0, express_1.Router)();
    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post('/fetch', authMiddleware_1.default.isAuthenticated, authMiddleware_1.default.isAdmin, this.fetchNews);
        this.router.get('/headlines', authMiddleware_1.default.isAuthenticated, this.getHeadlines);
        this.router.get('/search', authMiddleware_1.default.isAuthenticated, this.getSearch);
    }
    getHeadlines = async (req, res, next) => {
        try {
            const articles = await newsService_1.default.getHeadlines({
                filters: req.query,
                userId: req.user.id,
            });
            res.json(articles);
        }
        catch (error) {
            next(error);
        }
    };
    getSearch = async (req, res, next) => {
        try {
            const articles = await newsService_1.default.searchArticles({
                filters: req.query,
                userId: req.user.id,
            });
            res.json(articles);
        }
        catch (error) {
            next(error);
        }
    };
    fetchNews = async (req, res, next) => {
        try {
            const newArticles = await newsService_1.default.fetchAndStoreNews();
            res.status(200).json({ message: `Process complete. Saved ${newArticles.length} new articles.` });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.default = NewsRoutes;
