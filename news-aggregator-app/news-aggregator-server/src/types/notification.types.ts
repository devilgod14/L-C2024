import { Document, Schema } from 'mongoose';
import { IArticle } from './news.types';
import { IUserDocument } from './auth.types';

export interface INotificationSetting {
  userId: Schema.Types.ObjectId | IUserDocument;
  enabledCategories: string[];
  keywords: string[];
}

export interface INotification {
  userId: Schema.Types.ObjectId | IUserDocument;
  articleId: Schema.Types.ObjectId | IArticle;
  message: string;
  isRead: boolean;
}

export interface INotificationSettingDocument extends INotificationSetting, Document {}
export interface INotificationDocument extends INotification, Document {}