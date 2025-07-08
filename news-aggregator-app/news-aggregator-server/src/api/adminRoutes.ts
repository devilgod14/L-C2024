import { Router, Request, Response, NextFunction } from 'express';
import adminService from '../services/adminService';
import authMiddleware from '../middleware/authMiddleware';

class AdminRoutes {
  public router: Router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.use(authMiddleware.isAuthenticated, authMiddleware.isAdmin);

    // Source Routes
    this.router.get('/sources', this.getSources);
    this.router.put('/sources/:id', this.updateSource);
    this.router.get('/sources/:id', this.getSourceDetails);

    // Category Routes
    this.router.post('/categories', this.addCategory);
    this.router.put('/categories/:id/hide', this.hideCategory);
    this.router.put('/categories/:id/unhide', this.unhideCategory);
    
    // Report Routes
    this.router.get('/reports', this.getReportedArticles);
    
    // Article Moderation Routes
    this.router.put('/articles/:id/hide', this.hideArticle);
    this.router.put('/articles/:id/unhide', this.unhideArticle);

    // Keyword Routes
    this.router.get('/keywords', this.getBlockedKeywords);
    this.router.post('/keywords', this.addBlockedKeyword);
    this.router.delete('/keywords/:id', this.removeBlockedKeyword);
  }

  private getSources = async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await adminService.getAllSources()); } catch (error) { next(error); }
  };
  private updateSource = async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await adminService.updateSourceApiKey(req.params.id, req.body.apiKey)); } catch (error) { next(error); }
  };

  private getSourceDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.json(await adminService.getSourceById(req.params.id));
    } catch (error) {
        next(error);
    }
  };
  
  private addCategory = async (req: Request, res: Response, next: NextFunction) => {
    try { res.status(201).json(await adminService.addCategory(req.body.name)); } catch (error) { next(error); }
  };
  private hideCategory = async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await adminService.hideCategory(req.params.id)); } catch (error) { next(error); }
  };
  private unhideCategory = async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await adminService.unhideCategory(req.params.id)); } catch (error) { next(error); }
  };
  private getReportedArticles = async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await adminService.getReportedArticles()); } catch (error) { next(error); }
  };
  private hideArticle = async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await adminService.hideArticle(req.params.id)); } catch (error) { next(error); }
  };
  private unhideArticle = async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await adminService.unhideArticle(req.params.id)); } catch (error) { next(error); }
  };
  private getBlockedKeywords = async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await adminService.getBlockedKeywords()); } catch (error) { next(error); }
  };
  private addBlockedKeyword = async (req: Request, res: Response, next: NextFunction) => {
    try { res.status(201).json(await adminService.addBlockedKeyword({ keyword: req.body.keyword, adminId: req.user!.id })); } catch (error) { next(error); }
  };
  private removeBlockedKeyword = async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await adminService.removeBlockedKeyword(req.params.id)); } catch (error) { next(error); }
  };
}

export default AdminRoutes;