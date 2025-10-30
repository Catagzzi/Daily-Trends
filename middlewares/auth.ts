import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '@utils/errors';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return next(new UnauthorizedError('API Key is required'));
  }

  const validApiKey = process.env.API_KEY;

  if (!validApiKey) {
    console.error('API_KEY not set in environment variables');
    return next(new UnauthorizedError('Authentication error'));
  }

  if (apiKey !== validApiKey) {
    return next(new UnauthorizedError('Invalid API Key'));
  }

  next();
};
