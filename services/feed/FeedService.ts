import { Feed } from '../../types/feed';

export class FeedService {
  async getFeed(): Promise<Feed | null> {
    console.log(`Getting feed`);

    return null;
  }
}
