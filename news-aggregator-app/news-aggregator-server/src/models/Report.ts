import { model, Schema, Document } from 'mongoose';
import { IArticle } from '../types/news.types';
import { IUserDocument } from '../types/auth.types';

export interface IReport extends Document {
  articleId: Schema.Types.ObjectId | IArticle;
  userId: Schema.Types.ObjectId | IUserDocument;
  reason?: string;
}

const reportSchema = new Schema<IReport>({
  articleId: { type: Schema.Types.ObjectId, ref: 'Article', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, trim: true }
}, { timestamps: true });

reportSchema.index({ articleId: 1, userId: 1 }, { unique: true });

export default model<IReport>('Report', reportSchema);