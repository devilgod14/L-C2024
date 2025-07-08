import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/userRepository';
import { BadRequestError, UnauthorizedError } from '../utils/error';
import { IUser, IUserDocument, UserCredentials, UserRegistrationData } from '../types/auth.types';

class AuthService {
  public async registerUser(userData: UserRegistrationData): Promise<IUserDocument> {
    const { username, email, password } = userData;

    const userExists = await userRepository.findByEmail(email);
    if (userExists) {
      throw new BadRequestError('User already exists with that email');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return userRepository.create({ username, email, password: hashedPassword });
  }

  public async loginUser({ email, password }: UserCredentials): Promise<string> {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const payload = {
      user: {
        id: user.id, role: user.role, username: user.username, email: user.email,
      },
    };

    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });
  }
}

export default new AuthService();