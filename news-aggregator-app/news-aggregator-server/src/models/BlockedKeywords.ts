import { model, Schema, Document } from 'mongoose';
import { IUserDocument } from '../types/auth.types';

export interface IBlockedKeyword extends Document {
  keyword: string;
  addedBy: Schema.Types.ObjectId | IUserDocument;
}

const blockedKeywordSchema = new Schema<IBlockedKeyword>({
  keyword: { type: String, required: true, unique: true, trim: true, lowercase: true },
  addedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default model<IBlockedKeyword>('BlockedKeyword', blockedKeywordSchema);