import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '@utils/errors';

export const validateGetFeed = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { date } = req.query;

  if (!date) {
    return next(new BadRequestError('Query parameter "date" is required'));
  }
  next();
};

export const validateCreateNews = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title } = req.body;

  if (!title) {
    return next(new BadRequestError('Request body must include "title"'));
  }

  next();
};
