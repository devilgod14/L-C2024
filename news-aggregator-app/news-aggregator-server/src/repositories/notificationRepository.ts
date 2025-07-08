import Notification from "../models/Notification";
import NotificationSetting from "../models/NotificationSetting";
import { INotificationDocument, INotificationSettingDocument } from "../types/notification.types";


class NotificationRepository {
  public async findSettingsForUser(userId: string): Promise<INotificationSettingDocument | null> {
    return NotificationSetting.findOne({ userId });
  }

  public async findOrCreateSettingsForUser(userId: string): Promise<INotificationSettingDocument> {
    return NotificationSetting.findOneAndUpdate(
        { userId },
        { $setOnInsert: { userId, enabledCategories: [], keywords: [] } },
        { upsert: true, new: true }
    );
  }

  public async updateSettingsForUser(userId: string, settings: Partial<INotificationSettingDocument>): Promise<INotificationSettingDocument | null> {
    return NotificationSetting.findOneAndUpdate(
        { userId },
        { $set: settings },
        { new: true, upsert: true }
    );
  }
  
  public async findNotificationsForUser(userId: string): Promise<INotificationDocument[]> {
    return Notification.find({ userId })
      .sort({ createdAt: -1 })
      .populate('articleId', 'title url');
  }

  public async findAllSettingsWithUserEmail(): Promise<INotificationSettingDocument[]> {
    return NotificationSetting.find({}).populate('userId', 'email');
  }

  public async findExistingNotification(userId: string, articleId: string): Promise<INotificationDocument | null> {
    return Notification.findOne({ userId, articleId });
  }

  public async createNotification(userId: string, articleId: string, message: string): Promise<INotificationDocument> {
    return Notification.create({ userId, articleId, message });
  }
}

export default new NotificationRepository();