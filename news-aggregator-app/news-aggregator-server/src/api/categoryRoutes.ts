import { Router, Request, Response, NextFunction } from 'express';
import newsRepository from '../repositories/newsRepository';
import authMiddleware from '../middleware/authMiddleware';

class CategoryRoutes {
  public router: Router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', authMiddleware.isAuthenticated, this.getAllCategories);
  }

  private getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Logic to get all categories, likely from a repository
      const categories = await newsRepository.findAllCategories(); // Assumes this method exists
      res.json(categories);
    } catch (error) {
      next(error);
    }
  };
}

export default CategoryRoutes