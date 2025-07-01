const Vote = require('../models/Vote');
const SavedArticle = require('../models/SavedArticle');
const ReadHistory = require('../models/ReadHistory');
const NotificationSetting = require('../models/NotificationSetting');

class RecommendationService {
  constructor() {
    this.weights = {
      SAVED_CATEGORY: 15,         // Points for matching a category the user has saved from
      LIKED_CATEGORY: 10,         // Points for matching a category the user has liked from
      READ_CATEGORY: 5,           // Points for matching a category the user has read from
      NOTIFICATION_CATEGORY: 20,  // Points for matching a category in notification settings
      NOTIFICATION_KEYWORD: 25,   // Points for matching a keyword in notification settings
    };
  }

  async scoreArticlesForUser({ userId, articles }) {
    if (!userId || !articles || articles.length === 0) {
      return articles.map(a => ({ ...a.toObject(), relevanceScore: 0 }));
    }

    const [settings, likedVotes, saved, readHistory] = await Promise.all([
      NotificationSetting.findOne({ userId }),
      Vote.find({ userId, vote: 'like' }).populate('articleId', 'categoryId'),
      SavedArticle.find({ userId }).populate('articleId', 'categoryId'),
      ReadHistory.find({ userId }).populate('articleId', 'categoryId'),
    ]);

    const categoryInterest = {}; 

    const addInterest = (categoryId, weight) => {
        if (!categoryId) return;
        const id = categoryId.toString();
        categoryInterest[id] = (categoryInterest[id] || 0) + weight;
    };

    likedVotes.forEach(vote => addInterest(vote.articleId?.categoryId, this.weights.LIKED_CATEGORY));
    saved.forEach(item => addInterest(item.articleId?.categoryId, this.weights.SAVED_CATEGORY));
    readHistory.forEach(item => addInterest(item.articleId?.categoryId, this.weights.READ_CATEGORY));
    
    const notificationKeywords = settings?.keywords || [];
    const notificationCategories = settings?.enabledCategories || [];

    const scoredArticles = articles.map(article => {
      let relevanceScore = 0;
      const articleText = `${article.title} ${article.description}`.toLowerCase();
      const articleCategoryId = article.categoryId._id.toString();

      if (notificationCategories.includes(article.categoryId.name)) {
        relevanceScore += this.weights.NOTIFICATION_CATEGORY;
      }

      notificationKeywords.forEach(keyword => {
        if (articleText.includes(keyword.toLowerCase())) {
          relevanceScore += this.weights.NOTIFICATION_KEYWORD;
        }
      });
      
      if (categoryInterest[articleCategoryId]) {
        relevanceScore += categoryInterest[articleCategoryId];
      }
      
      return { ...article.toObject(), relevanceScore };
    });

    return scoredArticles;
  }
}

module.exports = new RecommendationService();