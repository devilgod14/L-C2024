import { model, Schema, Document } from 'mongoose';
import { IArticle } from '../types/news.types';
import { IUserDocument } from '../types/auth.types';

export interface IReadHistory extends Document {
  userId: Schema.Types.ObjectId | IUserDocument;
  articleId: Schema.Types.ObjectId | IArticle;
}

const readHistorySchema = new Schema<IReadHistory>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  articleId: { type: Schema.Types.ObjectId, ref: 'Article', required: true },
}, { timestamps: true });

readHistorySchema.index({ userId: 1, articleId: 1 }, { unique: true });

export default model<IReadHistory>('ReadHistory', readHistorySchema);