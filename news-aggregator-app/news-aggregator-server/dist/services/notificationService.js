"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notificationRepository_1 = __importDefault(require("../repositories/notificationRepository"));
const emailService_1 = __importDefault(require("./emailService"));
const logger_1 = __importDefault(require("../config/logger"));
class NotificationService {
    async getSettings(userId) {
        return notificationRepository_1.default.findOrCreateSettingsForUser(userId);
    }
    async updateSettings(userId, newSettings) {
        return notificationRepository_1.default.updateSettingsForUser(userId, newSettings);
    }
    async getNotificationsForUser(userId) {
        return notificationRepository_1.default.findNotificationsForUser(userId);
    }
    async generateNotificationsForArticles(newArticles) {
        if (!newArticles || newArticles.length === 0)
            return;
        logger_1.default.info(`Processing ${newArticles.length} new articles for notifications...`);
        const allSettings = await notificationRepository_1.default.findAllSettingsWithUserEmail();
        if (allSettings.length === 0)
            return;
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
                    const existingNotif = await notificationRepository_1.default.findExistingNotification(user.id, article.id);
                    if (!existingNotif) {
                        const message = `A new article, "${article.title}", is available because ${matchReason}`;
                        await Promise.all([
                            notificationRepository_1.default.createNotification(user.id, article.id, message),
                            emailService_1.default.send({
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
exports.default = new NotificationService();
