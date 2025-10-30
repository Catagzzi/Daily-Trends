import { Feed } from '@appTypes/feed';
import { NotFoundError, InternalServerError } from '@utils/errors';

export class FeedService {
  async getFeed(): Promise<Feed> {
    try {
      console.log(`Getting feed`);
      const feed = null;

      if (!feed) {
        throw new NotFoundError('Feed not found');
      }

      return feed;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      console.error('Unexpected error in getFeed:', error);
      throw new InternalServerError(
        'An unexpected error occurred while fetching the feed'
      );
    }
  }
}
