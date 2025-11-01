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
      console.log(`Creating new news item ${title}`);

      res.status(201).json({
        status: 'success',
        message: 'News item created successfully (dummy response)',
        data: {
          id: `news_${Date.now()}`,
          title,
          createdAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
