import { Document, Schema } from 'mongoose';
import { IArticle } from './news.types';
import { IUserDocument } from './auth.types';

export interface ISavedArticle {
  userId: Schema.Types.ObjectId | IUserDocument;
  articleId: Schema.Types.ObjectId | IArticle;
}

export interface ISavedArticleDocument extends ISavedArticle, Document {}