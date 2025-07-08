import { model, Schema } from 'mongoose';
import { IUserDocument } from '../types/auth.types';

const userSchema = new Schema<IUserDocument>({
  username: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['User', 'Admin'], default: 'User' }
}, { timestamps: true });

export default model<IUserDocument>('User', userSchema);