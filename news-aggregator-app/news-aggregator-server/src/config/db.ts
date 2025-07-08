import mongoose from 'mongoose';
import logger from './logger';

class DatabaseService {
  public async connect(): Promise<void> {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI!);
      logger.info(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      logger.error('Database connection failed', error);
      process.exit(1);
    }
  }
}

export default new DatabaseService();