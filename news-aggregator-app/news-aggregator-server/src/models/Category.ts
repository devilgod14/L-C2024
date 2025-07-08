import { model, Schema } from 'mongoose';
import { ICategoryDocument } from '../types/news.types';

const categorySchema = new Schema<ICategoryDocument>({
  name: { type: String, required: true, unique: true, trim: true },
  isHidden: { type: Boolean, default: false }
}, { timestamps: true });

export default model<ICategoryDocument>('Category', categorySchema);