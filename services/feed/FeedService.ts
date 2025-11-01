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

  async createNewsItem(newsItem: NewsItem) {
    try {
      const { link } = newsItem;
      const existingNewsItem = await this.repository.findByLink(link);
      if (existingNewsItem) {
        throw new BadRequestError(`Article link already exists: ${link}`);
      }
      const newNewsItem = await this.repository.createNewsItem(newsItem);
      return newNewsItem;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new InternalServerError('Failed to create news item');
    }
  }

  async getNewsItem(id: string) {
    try {
      const newsItem = await this.repository.findById(id);
      if (!newsItem) {
        throw new BadRequestError(`News item not found: ${id}`);
      }
      return newsItem;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new InternalServerError('Error getting news item');
    }
  }

  async deleteNewsItem(id: string) {
    try {
      const newsItem = await this.repository.findById(id);
      if (!newsItem) {
        throw new BadRequestError(`News item not found: ${id}`);
      }
      await this.repository.deleteById(id);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new InternalServerError('Error deleting news item');
    }
  }

  async updateNewsItem(id: string, data: Partial<NewsItem>) {
    try {
      const newsItem = await this.repository.findById(id);
      if (!newsItem) {
        throw new BadRequestError(`News item not found: ${id}`);
      }

      if (data.link && data.link !== newsItem.link) {
        const existing = await this.repository.findByLink(data.link);
        if (existing) {
          throw new BadRequestError(`Link already exists: ${data.link}`);
        }
      }

      const updatedNewsItem = await this.repository.updateById(id, data);
      return updatedNewsItem;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new InternalServerError('Error updating news item');
    }
  }
}
