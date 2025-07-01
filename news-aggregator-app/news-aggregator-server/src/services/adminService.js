const ExternalAPISource = require('../models/ExternalAPISource');
const Category = require('../models/Category');
const Article = require('../models/Article');
const BlockedKeywords = require('../models/BlockedKeywords');

class AdminService {

   async getAllSources() {
    return ExternalAPISource.find({});
 }

  async updateSourceApiKey(sourceId, newApiKey) {
    const source = await ExternalAPISource.findById(sourceId);
    if (!source) {
      throw new Error('Source not found.');
    }
    source.apiKey = newApiKey;
    await source.save();
    return source;
  }

  async getSourceById(sourceId) {
    const source = await ExternalAPISource.findById(sourceId);
    if (!source) {
    throw new Error('Source not found.');
    }
    return source;
  }

  async addCategory(categoryName) {

    const lowerCaseName = categoryName.trim().toLowerCase();
    const standardCategoryName = lowerCaseName.charAt(0).toUpperCase() + lowerCaseName.slice(1);

    const existingCategory = await Category.findOne({ name: standardCategoryName });
    if (existingCategory) {
      throw new Error('Category already exists.');
    }
    const newCategory = new Category({ name: standardCategoryName });
    await newCategory.save();
    return newCategory;
  }

  async getReportedArticles() {
    return Article.find({ reportCount: { $gt: 0 }, isHidden: false })
      .sort({ reportCount: -1 });
  }

  async hideArticle(articleId) {
    return Article.findByIdAndUpdate(articleId, { isHidden: true }, { new: true });
  }

  async unhideArticle(articleId) {
    return Article.findByIdAndUpdate(articleId, { isHidden: false }, { new: true });
  }

  async hideCategory(categoryId) {
    return Category.findByIdAndUpdate(categoryId, { isHidden: true }, { new: true });
  }

  async unhideCategory(categoryId) {
    return Category.findByIdAndUpdate(categoryId, { isHidden: false }, { new: true });
  }
  
   async getBlockedKeywords() {
    return BlockedKeywords.find({}).sort({ keyword: 1 });
  }

  async addBlockedKeyword({ keyword, adminId }) {
    const keywordStr = keyword.trim().toLowerCase();
    const existing = await BlockedKeywords.findOne({ keyword: keywordStr });
    if (existing) {
      throw new Error('Keyword already exists in the blocklist.');
    }
    const newKeyword = new BlockedKeywords({ keyword: keywordStr, addedBy: adminId });
    await newKeyword.save();
    return newKeyword;
  }

  async removeBlockedKeyword(keywordId) {
    const result = await BlockedKeywords.findByIdAndDelete(keywordId);
    if (!result) {
      throw new Error('Keyword not found.');
    }
    return { message: 'Keyword removed successfully.' };
  }
}

module.exports = new AdminService();