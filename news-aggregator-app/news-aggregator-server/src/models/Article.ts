import { model, Schema } from 'mongoose';
import { IArticleDocument } from '../types/news.types';

const articleSchema = new Schema<IArticleDocument>({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  url: { type: String, required: true, unique: true },
  publishedAt: { type: Date, required: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  isHidden: { type: Boolean, default: false, index: true },
  reportCount: { type: Number, default: 0 },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  sourceId: { type: Schema.Types.ObjectId, ref: 'ExternalAPISource', required: true }
}, { timestamps: true });

articleSchema.index({ title: 'text', description: 'text' });

export default model<IArticleDocument>('Article', articleSchema);