import { model, Schema } from 'mongoose';
import { INotificationDocument } from '../types/notification.types';

const notificationSchema = new Schema<INotificationDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  articleId: { type: Schema.Types.ObjectId, ref: 'Article', required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

export default model<INotificationDocument>('Notification', notificationSchema);