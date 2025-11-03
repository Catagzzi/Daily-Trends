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

  async findById(id: string): Promise<INewsItem | null> {
    return NewsItemModel.findById(id);
  }

  async deleteById(id: string): Promise<void> {
    await NewsItemModel.findByIdAndDelete(id);
  }

  async updateById(
    id: string,
    data: Partial<NewsItem>
  ): Promise<INewsItem | null> {
    return NewsItemModel.findByIdAndUpdate(id, data, { new: true });
  }

  async getFeedByDate(
    date: string,
    page: number,
    limit: number
  ): Promise<{ items: INewsItem[]; total: number }> {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const query = {
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      NewsItemModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      NewsItemModel.countDocuments(query),
    ]);
    if (items?.length === 0) {
      console.log(`No items found for today: ${date}`);
      return { items: [], total: 0 };
    }
    return { items, total };
  }
}
