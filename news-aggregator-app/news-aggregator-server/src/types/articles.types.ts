import { Document, Schema } from 'mongoose';
import { IArticle } from './news.types';
import { IUserDocument } from './auth.types';

export interface IVote {
  userId: Schema.Types.ObjectId | IUserDocument;
  articleId: Schema.Types.ObjectId | IArticle;
  vote: 'like' | 'dislike';
}

export interface IVoteDocument extends IVote, Document {}