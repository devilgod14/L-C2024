"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adminRepository_1 = __importDefault(require("../repositories/adminRepository"));
const error_1 = require("../utils/error");
class AdminService {
    async getAllSources() {
        return adminRepository_1.default.findAllSources();
    }
    async getSourceById(sourceId) {
        const source = await adminRepository_1.default.findSourceById(sourceId);
        if (!source) {
            throw new error_1.NotFoundError('Source not found.');
        }
        return source;
    }
    async updateSourceApiKey(sourceId, newApiKey) {
        const source = await adminRepository_1.default.findSourceById(sourceId);
        if (!source)
            throw new error_1.NotFoundError('Source not found.');
        return adminRepository_1.default.updateSource(sourceId, { apiKey: newApiKey });
    }
    async addCategory(categoryName) {
        const standardCategoryName = categoryName.trim().charAt(0).toUpperCase() + categoryName.trim().slice(1).toLowerCase();
        const existingCategory = await adminRepository_1.default.findCategoryByName(standardCategoryName);
        if (existingCategory)
            throw new error_1.BadRequestError('Category already exists.');
        return adminRepository_1.default.createCategory(standardCategoryName);
    }
    async getReportedArticles() {
        return adminRepository_1.default.findReportedArticles();
    }
    async hideArticle(articleId) {
        return adminRepository_1.default.setArticleVisibility(articleId, true);
    }
    async unhideArticle(articleId) {
        return adminRepository_1.default.setArticleVisibility(articleId, false);
    }
    async hideCategory(categoryId) {
        return adminRepository_1.default.setCategoryVisibility(categoryId, true);
    }
    async unhideCategory(categoryId) {
        return adminRepository_1.default.setCategoryVisibility(categoryId, false);
    }
    async getBlockedKeywords() {
        return adminRepository_1.default.findAllBlockedKeywords();
    }
    async addBlockedKeyword({ keyword, adminId }) {
        const keywordStr = keyword.trim().toLowerCase();
        const existing = await adminRepository_1.default.findBlockedKeyword(keywordStr);
        if (existing)
            throw new error_1.BadRequestError('Keyword already exists in the blocklist.');
        return adminRepository_1.default.createBlockedKeyword(keywordStr, adminId);
    }
    async removeBlockedKeyword(keywordId) {
        const result = await adminRepository_1.default.deleteBlockedKeyword(keywordId);
        if (!result)
            throw new error_1.NotFoundError('Keyword not found.');
        return result;
    }
}
exports.default = new AdminService();
