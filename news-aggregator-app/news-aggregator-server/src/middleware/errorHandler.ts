import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';
import { AppError } from '../utils/error';

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  logger.error(err);

  if (err instanceof AppError && err.isOperational) {
    res.status(err.statusCode).json({
      message: err.message,
    });
  }

  res.status(500).json({
    message: 'An unexpected error occurred on the server.',
  });
};

export default errorHandler;