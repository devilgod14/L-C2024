import notificationRepository from '../repositories/notificationRepository';
import emailService from './emailService';
import { IArticleDocument, ICategoryDocument } from '../types/news.types';
import logger from '../config/logger';

class NotificationService {
  public async getSettings(userId: string) {
    return notificationRepository.findOrCreateSettingsForUser(userId);
  }

  public async updateSettings(userId: string, newSettings: any) {
    return notificationRepository.updateSettingsForUser(userId, newSettings);
  }

  public async getNotificationsForUser(userId: string) {
    return notificationRepository.findNotificationsForUser(userId);
  }

  public async generateNotificationsForArticles(newArticles: IArticleDocument[]) {
    if (!newArticles || newArticles.length === 0) return;
    logger.info(`Processing ${newArticles.length} new articles for notifications...`);

    const allSettings = await notificationRepository.findAllSettingsWithUserEmail();
    if (allSettings.length === 0) return;

    for (const article of newArticles) {
      if (!article.categoryId || typeof article.categoryId !== 'object' || !('name' in article.categoryId)) {
        continue;
      }

      const articleText = `${article.title} ${article.description}`.toLowerCase();
      const articleCategoryName = article.categoryId.name;

      for (const setting of allSettings) {
        if (!setting.userId || typeof setting.userId !== 'object' || !('email' in setting.userId)) {
          continue;
        }

        const user = setting.userId;
        let match = false;
        let matchReason = '';

        if (setting.enabledCategories.includes(articleCategoryName)) {
          match = true;
          matchReason = `its category '${articleCategoryName}' matches your preferences.`;
        }

        if (!match && setting.keywords.length > 0) {
          for (const keyword of setting.keywords) {
            if (articleText.includes(keyword.toLowerCase())) {
              match = true;
              matchReason = `it contains your keyword '${keyword}'.`;
              break;
            }
          }
        }

        if (match) {
          const existingNotif = await notificationRepository.findExistingNotification(user.id, article.id);
          if (!existingNotif) {
            const message = `A new article, "${article.title}", is available because ${matchReason}`;
            
            await Promise.all([
              notificationRepository.createNotification(user.id, article.id, message),
              emailService.send({
                to: user.email,
                subject: `New Article Notification: ${article.title}`,
                html: `<h1>New Article!</h1><p>${message}</p><a href="${article.url}">Read more</a>`,
              })
            ]);
          }
        }
      }
    }
  }
}

export default new NotificationService();