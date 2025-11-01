import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '@utils/errors';
import { getFeedSchema } from '@appTypes/feed';
import { z } from 'zod';


export function validateGetFeed(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    getFeedSchema.parse(req.query);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.issues
        .map((issue) => `${issue.path.join('.')} -> ${issue.message}`)
        .join(', ');
      console.log(`Error in request validation: ${message}`);
      return next(new BadRequestError(message));
    }
    next(error);
  }
};

export function validateCreateNews(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { title } = req.body;

  if (!title) {
    return next(new BadRequestError('Request body must include "title"'));
  }

  next();
};
