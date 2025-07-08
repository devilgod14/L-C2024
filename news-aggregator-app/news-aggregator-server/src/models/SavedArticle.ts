import { model, Schema } from 'mongoose';
import { ISavedArticleDocument } from '../types/user.types';

const savedArticleSchema = new Schema<ISavedArticleDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  articleId: { type: Schema.Types.ObjectId, ref: 'Article', required: true },
}, { timestamps: true });

savedArticleSchema.index({ userId: 1, articleId: 1 }, { unique: true });

export default model<ISavedArticleDocument>('SavedArticle', savedArticleSchema);