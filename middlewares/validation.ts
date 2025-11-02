import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '@utils/errors';
import { getFeedSchema, createNewsSchema, getNewsSchema, updateNewsSchema } from '@appTypes/feed';
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
  try {
    createNewsSchema.parse(req.body);
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
}

export function validateGetNews(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    getNewsSchema.parse({ id: req.params.id });
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
}

export function validateUpdateNews(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const dataToUpdate = {id: req.params.id,  ...req.body };
    updateNewsSchema.parse(dataToUpdate);
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
