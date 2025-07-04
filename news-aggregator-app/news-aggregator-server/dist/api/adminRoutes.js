"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminService_1 = __importDefault(require("../services/adminService"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
class AdminRoutes {
    router = (0, express_1.Router)();
    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.use(authMiddleware_1.default.isAuthenticated, authMiddleware_1.default.isAdmin);
        // Source Routes
        this.router.get('/sources', this.getSources);
        this.router.put('/sources/:id', this.updateSource);
        this.router.get('/sources/:id', this.getSourceDetails);
        // Category Routes
        this.router.post('/categories', this.addCategory);
        this.router.put('/categories/:id/hide', this.hideCategory);
        this.router.put('/categories/:id/unhide', this.unhideCategory);
        // Report Routes
        this.router.get('/reports', this.getReportedArticles);
        // Article Moderation Routes
        this.router.put('/articles/:id/hide', this.hideArticle);
        this.router.put('/articles/:id/unhide', this.unhideArticle);
        // Keyword Routes
        this.router.get('/keywords', this.getBlockedKeywords);
        this.router.post('/keywords', this.addBlockedKeyword);
        this.router.delete('/keywords/:id', this.removeBlockedKeyword);
    }
    getSources = async (req, res, next) => {
        try {
            res.json(await adminService_1.default.getAllSources());
        }
        catch (error) {
            next(error);
        }
    };
    updateSource = async (req, res, next) => {
        try {
            res.json(await adminService_1.default.updateSourceApiKey(req.params.id, req.body.apiKey));
        }
        catch (error) {
            next(error);
        }
    };
    getSourceDetails = async (req, res, next) => {
        try {
            res.json(await adminService_1.default.getSourceById(req.params.id));
        }
        catch (error) {
            next(error);
        }
    };
    addCategory = async (req, res, next) => {
        try {
            res.status(201).json(await adminService_1.default.addCategory(req.body.name));
        }
        catch (error) {
            next(error);
        }
    };
    hideCategory = async (req, res, next) => {
        try {
            res.json(await adminService_1.default.hideCategory(req.params.id));
        }
        catch (error) {
            next(error);
        }
    };
    unhideCategory = async (req, res, next) => {
        try {
            res.json(await adminService_1.default.unhideCategory(req.params.id));
        }
        catch (error) {
            next(error);
        }
    };
    getReportedArticles = async (req, res, next) => {
        try {
            res.json(await adminService_1.default.getReportedArticles());
        }
        catch (error) {
            next(error);
        }
    };
    hideArticle = async (req, res, next) => {
        try {
            res.json(await adminService_1.default.hideArticle(req.params.id));
        }
        catch (error) {
            next(error);
        }
    };
    unhideArticle = async (req, res, next) => {
        try {
            res.json(await adminService_1.default.unhideArticle(req.params.id));
        }
        catch (error) {
            next(error);
        }
    };
    getBlockedKeywords = async (req, res, next) => {
        try {
            res.json(await adminService_1.default.getBlockedKeywords());
        }
        catch (error) {
            next(error);
        }
    };
    addBlockedKeyword = async (req, res, next) => {
        try {
            res.status(201).json(await adminService_1.default.addBlockedKeyword({ keyword: req.body.keyword, adminId: req.user.id }));
        }
        catch (error) {
            next(error);
        }
    };
    removeBlockedKeyword = async (req, res, next) => {
        try {
            res.json(await adminService_1.default.removeBlockedKeyword(req.params.id));
        }
        catch (error) {
            next(error);
        }
    };
}
exports.default = AdminRoutes;
