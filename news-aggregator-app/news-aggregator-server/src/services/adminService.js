const ExternalAPISource = require('../models/ExternalAPISource');
const Category = require('../models/Category');

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
}

module.exports = new AdminService();