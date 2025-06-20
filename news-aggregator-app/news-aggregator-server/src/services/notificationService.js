const NotificationSetting = require('../models/NotificationSetting');
const Notification = require('../models/Notification');
const { sendEmail } = require('../utils/emailUtil')

class NotificationService {
  /**
   * Gets notification settings for a user. If none exist, it creates default settings.
   * @param {string} userId - The ID of the user
   * @returns {object} The user's notification settings document
   */
  async getSettings(userId) {
    // Find settings for the user. If not found, create a new one with default values.
    const settings = await NotificationSetting.findOneAndUpdate(
      { userId },
      { $setOnInsert: { userId, enabledCategories: [], keywords: [] } },
      { upsert: true, new: true }
    );
    return settings;
  }

  /**
   * Updates notification settings for a user.
   * @param {string} userId - The ID of the user
   * @param {object} newSettings - The new settings to apply
   * @returns {object} The updated notification settings document
   */
  async updateSettings(userId, newSettings) {
    const { enabledCategories, keywords } = newSettings;

    const updatedSettings = await NotificationSetting.findOneAndUpdate(
      { userId },
      { $set: { enabledCategories, keywords } },
      { new: true, upsert: true } 
    );
    return updatedSettings;
  }

  async getNotificationsForUser(userId) {
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 }) 
      .populate('articleId', 'title url'); 

    return notifications;
}

  async generateNotificationsForArticles(newArticles, transporter) {
    if (!newArticles || newArticles.length === 0) {
      return; 
    }
    console.log(`Processing ${newArticles.length} new articles for notifications...`);

    const allSettings = await NotificationSetting.find({}).populate('userId', 'email');

    for (const article of newArticles) {
      for (const setting of allSettings) {
        let match = false;
        let matchReason = '';

        if (setting.enabledCategories.includes(article.categoryId.name)) {
          match = true;
          matchReason = `its category '${article.categoryId.name}' matches your preferences.`;
        }

        if (!match && setting.keywords.length > 0) {
          for (const keyword of setting.keywords) {
            const regex = new RegExp(keyword, 'i'); 
            if (regex.test(article.title) || regex.test(article.description)) {
              match = true;
              matchReason = `it contains your keyword '${keyword}'.`;
              break; 
            }
          }
        }

        if (match) {
          const userId = setting.userId._id;
          const userEmail = setting.userId.email;

          const existingNotif = await Notification.findOne({ userId, articleId: article._id });
          if (!existingNotif) {
            const message = `A new article, "${article.title}", is available because ${matchReason}`;
            
            await Notification.create({
              userId,
              articleId: article._id,
              message,
            });

            await sendEmail({
              transporter,
              to: userEmail,
              subject: `New Article Notification: ${article.title}`,
              html: `<h1>New Article!</h1><p>${message}</p><a href="${article.url}">Read more</a>`,
            });
          }
        }
      }
    }
  }

}

module.exports = new NotificationService();