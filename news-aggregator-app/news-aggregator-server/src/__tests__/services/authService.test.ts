import authService from '../../services/authService';
import userRepository from '../../repositories/userRepository';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUserDocument } from '../../types/auth.types';
import { BadRequestError, UnauthorizedError } from '../../utils/error';

jest.mock('../../repositories/userRepository');
jest.mock('jsonwebtoken');

jest.mock('bcryptjs', () => ({
  genSalt: jest.fn().mockResolvedValue('a_fake_salt'),
  hash: jest.fn().mockResolvedValue('a_fake_hashed_password'),
  compare: jest.fn().mockImplementation((plain, hash) => {
    return Promise.resolve(plain === 'password123' && hash === 'a_fake_hashed_password');
  }),
}));


const mockedUserRepository = userRepository as jest.Mocked<typeof userRepository>;
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
    
      const userData = { username: 'testuser', email: 'test@example.com', password: 'password123' };
      mockedUserRepository.findByEmail.mockResolvedValue(null);
      mockedUserRepository.create.mockResolvedValue({ ...userData, id: 'some_id' } as any);

      await authService.registerUser(userData);

      expect(mockedBcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(mockedBcrypt.hash).toHaveBeenCalledWith('password123', 'a_fake_salt');
      expect(mockedUserRepository.create).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        password: 'a_fake_hashed_password',
      });
    });

    it('should throw BadRequestError if email is already in use', async () => {
      const userData = { username: 'testuser', email: 'test@example.com', password: 'password123' };
      mockedUserRepository.findByEmail.mockResolvedValue({ ...userData, id: 'some_id' } as any);

      await expect(authService.registerUser(userData)).rejects.toThrow(BadRequestError);
    });
  });

  describe('loginUser', () => {
    it('should return a token for valid credentials', async () => {
        const credentials = { email: 'test@example.com', password: 'password123' };
        const mockUser = {
            ...credentials,
            password: 'a_fake_hashed_password' 
        } as any;
        
        mockedUserRepository.findByEmail.mockResolvedValue(mockUser);

        await authService.loginUser(credentials);

        expect(mockedBcrypt.compare).toHaveBeenCalledWith('password123', 'a_fake_hashed_password');
        expect(jwt.sign).toHaveBeenCalled();
    });

    it('should throw UnauthorizedError for incorrect password', async () => {
        const credentials = { email: 'test@example.com', password: 'wrong_password' };
        const mockUser = { password: 'a_fake_hashed_password' } as any;
        
        mockedUserRepository.findByEmail.mockResolvedValue(mockUser);
        (mockedBcrypt.compare as jest.Mock).mockResolvedValue(false);

        await expect(authService.loginUser(credentials)).rejects.toThrow(UnauthorizedError);
    });
  });
});