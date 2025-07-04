import User from '../models/User';
import { IUserDocument, UserRegistrationData } from '../types/auth.types';

class UserRepository {
  public async findByEmail(email: string): Promise<IUserDocument | null> {
    return User.findOne({ email });
  }

  public async findById(id: string): Promise<IUserDocument | null> {
    return User.findById(id).select('-password');
  }

  public async create(userData: UserRegistrationData): Promise<IUserDocument> {
    const user = new User(userData);
    return user.save();
  }
}

export default new UserRepository();