import { Router, Request, Response, NextFunction } from 'express';
import newsService from '../services/newsService';
import authMiddleware from '../middleware/authMiddleware';
import { HeadlineFilters, SearchFilters } from '../types/news.types';

class NewsRoutes {
  public router: Router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/fetch', authMiddleware.isAuthenticated, authMiddleware.isAdmin, this.fetchNews);
    this.router.get('/headlines', authMiddleware.isAuthenticated, this.getHeadlines);
    this.router.get('/search', authMiddleware.isAuthenticated, this.getSearch);
  }

  private getHeadlines = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const articles = await newsService.getHeadlines({
        filters: req.query as HeadlineFilters,
        userId: req.user!.id,
      });
      res.json(articles);
    } catch (error) {
      next(error);
    }
  };

  private getSearch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const articles = await newsService.searchArticles({
        filters: req.query ,
        userId: req.user!.id,
      });
      res.json(articles);
    } catch (error) {
      next(error);
    }
  };

  private fetchNews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const newArticles = await newsService.fetchAndStoreNews();
      res.status(200).json({ message: `Process complete. Saved ${newArticles.length} new articles.` });
    } catch (error) {
      next(error);
    }
  };
}

export default NewsRoutes;