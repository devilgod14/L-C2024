const SavedArticle = require('../models/SavedArticle');

class UserService {
  /**
   * Retrieves all saved articles for a specific user
   * @param {string} userId - The ID of the user
   * @returns {Array} A list of saved articles with article details populated
   */

  async getSavedArticles(userId) {
    const savedArticles = await SavedArticle.find({ userId })
      .sort({ createdAt: -1 })
      .populate({
        path: 'articleId',
        model: 'Article',
        populate: { 
          path: 'categoryId sourceId',
          select: 'name'
        }
      });

    return savedArticles;
  }

  async saveArticle(userId, articleId) {

    const existingSave = await SavedArticle.findOne({ userId, articleId });
    if (existingSave) {
      throw new Error('Article has already been saved.');
    }

    const newSavedArticle = new SavedArticle({
      userId,
      articleId,
    });

    await newSavedArticle.save();

    return newSavedArticle;
}

async deleteSavedArticle(userId, savedArticleId) {

    const savedArticle = await SavedArticle.findById(savedArticleId);

    if (!savedArticle) {
      throw new Error('Saved article not found.');
    }
    if (savedArticle.userId.toString() !== userId) {
      throw new Error('User not authorized to delete this saved article.');
    }

    await SavedArticle.deleteOne({ _id: savedArticleId });

    return { message: 'Article removed successfully.' };
  }
}

module.exports = new UserService();