"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Article_1 = __importDefault(require("../models/Article"));
const ExternalAPISource_1 = __importDefault(require("../models/ExternalAPISource"));
const Category_1 = __importDefault(require("../models/Category"));
const BlockedKeywords_1 = __importDefault(require("../models/BlockedKeywords"));
class NewsRepository {
    async findActiveSources() {
        return ExternalAPISource_1.default.find({ status: 'Active' });
    }
    async findCategoryByName(name) {
        return Category_1.default.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
    }
    async findOrCreateCategory(name) {
        const standardName = name.trim().charAt(0).toUpperCase() + name.trim().slice(1).toLowerCase();
        return Category_1.default.findOneAndUpdate({ name: { $regex: `^${standardName}$`, $options: 'i' } }, { $set: { name: standardName } }, { upsert: true, new: true });
    }
    async findAllCategories() {
        return Category_1.default.find({}).sort({ name: 1 });
    }
    async findHiddenCategoryIds() {
        const hiddenCategories = await Category_1.default.find({ isHidden: true }).select('_id');
        return hiddenCategories.map((c) => c._id.toString());
    }
    async findAllBlockedKeywords() {
        const keywords = await BlockedKeywords_1.default.find({});
        return keywords.map((kw) => kw.keyword);
    }
    async findArticles(query, sort = { publishedAt: -1 }) {
        return Article_1.default.find(query)
            .sort(sort)
            .populate('categoryId', 'name')
            .populate('sourceId', 'name');
    }
    async updateArticleWithUpsert(url, data) {
        return Article_1.default.updateOne({ url }, { $setOnInsert: data }, { upsert: true });
    }
}
exports.default = new NewsRepository();
