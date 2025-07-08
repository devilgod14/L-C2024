import { notificationApi, categoryApi } from '../api';
import logger from '../config/logger';
import { CommonPrompts } from '../ui/commonPrompts';
import { NotificationPrompts } from '../ui/notificationPrompts';
import lm from '../utils/localizationManager';

export class NotificationFlows {
  private prompts = new NotificationPrompts();
  private commonPrompts = new CommonPrompts();

  private async handleConfigure(): Promise<void> {
    logger.info(lm.get('notifications.configureTitle'));
    try {
      // Fetch both the user's current settings and all available categories concurrently
      const [currentSettings, allCategories] = await Promise.all([
        notificationApi.getSettings(),
        categoryApi.getAll(),
      ]);

      const categoryNames = allCategories.map((c: any) => c.name);
      const newSettings = await this.prompts.forConfiguration(currentSettings, categoryNames);
      
      await notificationApi.updateSettings(newSettings);
      logger.info(lm.get('notifications.updateSuccess'));
    } catch (error: any) { /* The API layer handles logging */ }
  }

  private async handleView(): Promise<void> {
    logger.info(lm.get('fetching', { item: 'notifications' }));
    try {
        const notifications = await notificationApi.getViewableNotifications();
        if (notifications.length === 0) {
            logger.info(lm.get('notifications.none'));
            return;
        }
        logger.info(lm.get('notifications.title'));
        notifications.forEach((notif: any) => {
            logger.info(`\n[${new Date(notif.createdAt).toLocaleString()}] - ${notif.message}`);
        });
    } catch (error: any) { /* The API layer handles logging */ }
  }

  public async start(): Promise<void> {
    const choice = await this.prompts.forNotificationAction();
    switch (choice) {
      case lm.get('notifications.view'):
        await this.handleView();
        break;
      case lm.get('notifications.configure'):
        await this.handleConfigure();
        break;
      case lm.get('headlines.goBack'):
        return;
    }
  }
}