import { model, Schema } from 'mongoose';
import { IExternalAPISourceDocument } from '../types/news.types';

const externalAPISourceSchema = new Schema<IExternalAPISourceDocument>({
  name: { type: String, required: true, unique: true, trim: true },
  apiKey: { type: String, required: true },
  status: { type: String, enum: ['Active', 'Not Active'], required: true, default: 'Active' },
  lastAccessed: { type: Date }
}, { timestamps: true });

export default model<IExternalAPISourceDocument>('ExternalAPISource', externalAPISourceSchema);