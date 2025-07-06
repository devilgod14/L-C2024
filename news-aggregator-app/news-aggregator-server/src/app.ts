import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import databaseService from './config/db';
import logger from './config/logger';
import emailService from './services/emailService';
import errorHandler from './middleware/errorHandler';

import AuthRoutes from './api/authRoutes';
import NewsRoutes from './api/newsRoutes';
import ArticleRoutes from './api/articleRoutes';
import UserRoutes from './api/userRoutes';
import NotificationRoutes from './api/notificationRoutes';
import CategoryRoutes from './api/categoryRoutes';
import AdminRoutes from './api/adminRoutes';

class Server {
  public app: Application;
  public port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '3000', 10);
    this.initializeConfig();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeConfig(): void {
    dotenv.config();
    this.app.use(cors());
    this.app.use(express.json());
  }

  private initializeRoutes(): void {
    this.app.use('/api/auth', new AuthRoutes().router);
    this.app.use('/api/news', new NewsRoutes().router);
    this.app.use('/api/articles', new ArticleRoutes().router);
    this.app.use('/api/users', new UserRoutes().router);
    this.app.use('/api/notifications', new NotificationRoutes().router);
    this.app.use('/api/categories', new CategoryRoutes().router);
    this.app.use('/api/admin', new AdminRoutes().router);
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    try {
       await databaseService.connect();
      await emailService.initialize();
      require('./jobs/newsFetcherJob'); // Start the cron job

      this.app.listen(this.port, () => {
        logger.info(`Server is running on port ${this.port}`);
      });
    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }
}

// Start the server
const server = new Server();
if (process.env.NODE_ENV !== 'test') {
  server.start();
}

// Export app for testing
export default server.app;