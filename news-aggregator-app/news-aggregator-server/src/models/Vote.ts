import { model, Schema } from 'mongoose';
import { IVoteDocument } from '../types/articles.types';

const voteSchema = new Schema<IVoteDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  articleId: { type: Schema.Types.ObjectId, ref: 'Article', required: true },
  vote: { type: String, enum: ['like', 'dislike'], required: true },
}, { timestamps: true });

voteSchema.index({ userId: 1, articleId: 1 }, { unique: true });

export default model<IVoteDocument>('Vote', voteSchema);