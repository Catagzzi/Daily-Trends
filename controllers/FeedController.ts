import { Request, Response, NextFunction } from 'express';
import { FeedService } from '../services/feed/FeedService';

export class FeedController {
  private feedService: FeedService;

  constructor() {
    this.feedService = new FeedService();
  }

  getFeed = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const feed = await this.feedService.getFeed();

      res.json({
        status: 'success',
        data: feed,
      });
    } catch (error) {
      next(error);
    }
  };

  createFeed = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('Creating new feed');
      res.status(201).json({
        status: 'success',
        message: 'Feed created (not implemented yet)',
      });
    } catch (error) {
      next(error);
    }
  };
}
