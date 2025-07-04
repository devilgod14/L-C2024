import { Router, Request, Response, NextFunction } from 'express';
import articleService from '../services/articleService';
import authMiddleware from '../middleware/authMiddleware';

class ArticleRoutes {
  public router: Router = Router();
  constructor() { this.initializeRoutes(); }

  private initializeRoutes(): void {
    this.router.post('/:id/vote', authMiddleware.isAuthenticated, this.vote);
    this.router.post('/:id/read', authMiddleware.isAuthenticated, this.read);
    this.router.post('/:id/report', authMiddleware.isAuthenticated, this.report);
  }

  private vote = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const voteData = { userId: req.user!.id, articleId: req.params.id, voteType: req.body.vote };
      const updatedArticle = await articleService.handleVote(voteData);
      res.json(updatedArticle);
    } catch (error) { next(error); }
  };

   private read = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await articleService.logArticleRead({
            userId: req.user!.id,
            articleId: req.params.id,
        });
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
  };

  private report = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await articleService.reportArticle({
            userId: req.user!.id,
            articleId: req.params.id,
        });
        res.json(result);
    } catch (error) {
        next(error);
    }
};
}
export default ArticleRoutes;