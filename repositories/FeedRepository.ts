import { NewsItem as NewsItemModel, INewsItem } from '../models/NewsItem.model';
import { NewsItem } from '@appTypes/feed';

export class FeedRepository {
  async createNewsItem(data: NewsItem): Promise<INewsItem> {
    const newsItem = new NewsItemModel(data);
    return newsItem.save();
  }

  async findByLink(link: string): Promise<INewsItem | null> {
    return NewsItemModel.findOne({ link });
  }

  async getAllNews(): Promise<INewsItem[]> {
    return NewsItemModel.find().sort({ createdAt: -1 });
  }

  async getFeedByDate(date: string): Promise<INewsItem[]> {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    return NewsItemModel.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ createdAt: -1 });
  }
}
