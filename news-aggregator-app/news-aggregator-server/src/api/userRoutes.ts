import { Router, Request, Response, NextFunction } from 'express';
import userService from '../services/userService';
import authMiddleware from '../middleware/authMiddleware';

class UserRoutes {
    public router: Router = Router();
    constructor() { this.initializeRoutes(); }

    private initializeRoutes(): void {
        this.router.get('/me/saved-articles', authMiddleware.isAuthenticated, this.getSaved);
        this.router.post('/me/saved-articles', authMiddleware.isAuthenticated, this.saveArticle);
        this.router.delete('/me/saved-articles/:id', authMiddleware.isAuthenticated, this.deleteSaved);
    }

    private getSaved = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const articles = await userService.getSavedArticles(req.user!.id);
            res.json(articles);
        } catch (error) { next(error); }
    };

    private saveArticle = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { articleId } = req.body;
            const saved = await userService.saveArticle(req.user!.id, articleId);
            res.status(201).json(saved);
        } catch (error) { next(error); }
    };

    private deleteSaved = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await userService.deleteSavedArticle(req.user!.id, req.params.id);
            res.json({ message: 'Article removed from saved list' });
        } catch (error) { next(error); }
    };
}
export default UserRoutes;