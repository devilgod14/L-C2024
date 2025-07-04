import { Document } from 'mongoose';

export interface IUser {
  username: string;
  email: string;
  password: string;
  role: 'User' | 'Admin';
}
export interface IUserDocument extends IUser, Document {
  createdAt: Date;
  updatedAt: Date;
}

export type UserRegistrationData = Pick<IUser, 'username' | 'email' | 'password'>;

export type UserCredentials = Pick<IUser, 'email' | 'password'>;

export interface DecodedToken {
  user: {
    id: string;
    role: 'User' | 'Admin';
    username: string;
    email: string;
  };
}