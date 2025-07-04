import { model, Schema } from 'mongoose';
import { INotificationSettingDocument } from '../types/notification.types';

const notificationSettingSchema = new Schema<INotificationSettingDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  enabledCategories: { type: [String], default: [] },
  keywords: { type: [String], default: [] }
});

export default model<INotificationSettingDocument>('NotificationSetting', notificationSettingSchema);