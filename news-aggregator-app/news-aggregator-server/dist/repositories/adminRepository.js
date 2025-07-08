"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Article_1 = __importDefault(require("../models/Article"));
const BlockedKeywords_1 = __importDefault(require("../models/BlockedKeywords"));
const Category_1 = __importDefault(require("../models/Category"));
const ExternalAPISource_1 = __importDefault(require("../models/ExternalAPISource"));
class AdminRepository {
    async findAllSources() {
        return ExternalAPISource_1.default.find({});
    }
    async findSourceById(id) {
        return ExternalAPISource_1.default.findById(id);
    }
    async updateSource(id, data) {
        return ExternalAPISource_1.default.findByIdAndUpdate(id, { $set: data }, { new: true });
    }
    async createCategory(name) {
        return Category_1.default.create({ name });
    }
    async findCategoryByName(name) {
        return Category_1.default.findOne({ name });
    }
    async setCategoryVisibility(id, isHidden) {
        return Category_1.default.findByIdAndUpdate(id, { isHidden }, { new: true });
    }
    async findReportedArticles() {
        return Article_1.default.find({ reportCount: { $gt: 0 }, isHidden: false }).sort({ reportCount: -1 });
    }
    async setArticleVisibility(id, isHidden) {
        return Article_1.default.findByIdAndUpdate(id, { isHidden }, { new: true });
    }
    async findAllBlockedKeywords() {
        return BlockedKeywords_1.default.find({}).sort({ keyword: 1 });
    }
    async createBlockedKeyword(keyword, adminId) {
        return BlockedKeywords_1.default.create({ keyword, addedBy: adminId });
    }
    async findBlockedKeyword(keyword) {
        return BlockedKeywords_1.default.findOne({ keyword });
    }
    async deleteBlockedKeyword(id) {
        return BlockedKeywords_1.default.findByIdAndDelete(id);
    }
}
exports.default = new AdminRepository();
