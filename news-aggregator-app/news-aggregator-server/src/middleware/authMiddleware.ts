import { Response, NextFunction, Request } from 'express';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/userRepository';
import { DecodedToken } from '../types/auth.types';
import { UnauthorizedError } from '../utils/error';

class AuthMiddleware {
  public isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
        req.user = await userRepository.findById(decoded.user.id);

        return next();
      } catch (error) {
        throw new UnauthorizedError('Not authorized, token failed');
      }
    }
    throw new UnauthorizedError('Not authorized, no token');
  };

  public isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'Admin') {
      return next();
    }
    throw new UnauthorizedError('Forbidden. Admin access required.');
  };
}

export default new AuthMiddleware();