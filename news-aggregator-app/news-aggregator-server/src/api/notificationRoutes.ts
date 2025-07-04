import { Router, Request, Response, NextFunction } from 'express';
import notificationService from '../services/notificationService';
import authMiddleware from '../middleware/authMiddleware';

class NotificationRoutes {
  public router: Router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.use(authMiddleware.isAuthenticated);
    this.router.get('/', this.getNotifications);
    this.router.get('/settings', this.getSettings);
    this.router.put('/settings', this.updateSettings);
  }

  private getNotifications = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notifications = await notificationService.getNotificationsForUser(req.user!.id);
      res.json(notifications);
    } catch (error) { next(error); }
  };

  private getSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const settings = await notificationService.getSettings(req.user!.id);
      res.json(settings);
    } catch (error) { next(error); }
  };

  private updateSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedSettings = await notificationService.updateSettings(req.user!.id, req.body);
      res.json(updatedSettings);
    } catch (error) { next(error); }
  };
}

export default NotificationRoutes;