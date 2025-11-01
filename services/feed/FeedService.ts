import { InternalServerError, BadRequestError } from '@utils/errors';
import { FeedRepository } from '../../repositories/FeedRepository';
import { NewsItem } from '@appTypes/feed';
export class FeedService {
  private readonly repository: FeedRepository;

  constructor() {
    this.repository = new FeedRepository();
  }

  async getFeed(date: string, page: number, limit: number) {
    try {
      const { items, total } = await this.repository.getFeedByDate(
        date,
        page,
        limit
      );

      const totalPages = Math.ceil(total / limit);

      return {
        newsItems: items,
        pagination: {
          currentPage: page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new InternalServerError('Failed to fetch feed');
    }
  }

  async createNewsItem(newsItem: NewsItem): Promise<NewsItem> {
    try {
      const { link } = newsItem;
      const existingNewsItem = await this.repository.findByLink(link);
      if (existingNewsItem) {
        throw new BadRequestError(`Article link already exists: ${link}`);
      }
      const newNewsItem = await this.repository.createNewsItem(newsItem);
      return newNewsItem;
    } catch (error) {
      throw new InternalServerError(`Failed to create news item: ${error}`);
    }
  }
}
