import { NewsItem, INewsItem } from '../models/NewsItem.model';

export class FeedRepository {
  async createNewsItem(data: { title: string }): Promise<INewsItem> {
    const newsItem = new NewsItem(data);
    return newsItem.save();
  }

  async getAllFeed(): Promise<INewsItem[]> {
    return NewsItem.find().sort({ createdAt: -1 });
  }

  async getFeedByDate(date: string): Promise<INewsItem[]> {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    return NewsItem.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ createdAt: -1 });
  }
}
