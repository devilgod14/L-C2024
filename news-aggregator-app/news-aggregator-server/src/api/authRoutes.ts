import { Router, Request, Response, NextFunction } from 'express';
import authService from '../services/authService';
import authMiddleware from '../middleware/authMiddleware';

class AuthRoutes {
  public router: Router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/signup', this.signup);
    this.router.post('/login', this.login);
    this.router.get('/me', authMiddleware.isAuthenticated, this.getMe);
  }

  private signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const newUser = await authService.registerUser(req.body);
      const userToReturn = {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
      };
      res.status(201).json(userToReturn);
    } catch (error) {
      next(error);
    }
  };

  private login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      const token = await authService.loginUser({ email, password });
      res.json({ token });
    } catch (error) {
      next(error);
    }
  };
  
  private getMe = (req: Request, res: Response, next: NextFunction): void => {

    try {
        res.status(200).json(req.user);
    } catch (error) {
        next(error);
    }
  };
}

export default AuthRoutes;