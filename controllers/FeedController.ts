import { Request, Response, NextFunction } from 'express';
import { FeedService } from '../services/feed/FeedService';

export class FeedController {
  private readonly feedService: FeedService;

  constructor() {
    this.feedService = new FeedService();
  }

  getFeed = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { date, page, limit } = req.query;
      const feed = await this.feedService.getFeed(
        date as string,
        Number(page) || 1,
        Number(limit) || 5
      );

      res.json({
        status: 'success',
        data: feed,
      });
    } catch (error) {
      next(error);
    }
  };

  createNewsItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title } = req.body;
      console.log(`Creating new item: ${title}`);

      const createdNewsItem = await this.feedService.createNewsItem(req.body);

      res.status(201).json({
        status: 'success',
        data: createdNewsItem,
      });
    } catch (error) {
      next(error);
    }
  };
}
