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

  getNewsItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const newsItem = await this.feedService.getNewsItem(id);

      res.json({
        status: 'success',
        data: newsItem,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteNewsItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.feedService.deleteNewsItem(id);

      res.json({
        status: 'success',
        message: 'News item deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  updateNewsItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updatedNewsItem = await this.feedService.updateNewsItem(id, req.body);

      res.json({
        status: 'success',
        data: updatedNewsItem,
      });
    } catch (error) {
      next(error);
    }
  };
}
