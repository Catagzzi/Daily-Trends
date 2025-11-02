import { mongoDB } from '../../config/database';
import { FeedRepository } from '../../repositories/FeedRepository';
import { ElPaisScraper } from './ElPaisScraper';
import { ElMundoScraper } from './ElMundoScraper';
import { NewsItem } from '@appTypes/feed';

async function run(): Promise<void> {
  try {
    await mongoDB.connect();
    console.log('Database connected');

    const repository = new FeedRepository();
    const elPaisScraper = new ElPaisScraper();
    const elMundoScraper = new ElMundoScraper();
    const scrapers = [elPaisScraper, elMundoScraper];

    for (const scraper of scrapers) {
      console.log(`Starting scraper for: ${scraper.sourceName}`);
      const newsItems = await scraper.run();
      const savedCount = await saveNewsItems(newsItems, repository);
      console.log(`Saved ${savedCount} new items`);
    }
  } catch (error) {
    console.error('Error in scraping process: ', error);
    process.exit(1);
  } finally {
    await mongoDB.disconnect();
    console.log('Database disconnected');
    process.exit(0);
  }
}

async function saveNewsItems(
  newsItems: NewsItem[],
  repository: FeedRepository
): Promise<number> {
  let newItemsCount = 0;
  if (newsItems.length === 0) {
    return 0;
  }
  console.log('Check if already exists in mongo');
  for (const item of newsItems) {
    const existingItem = await repository.findByLink(item.link);
    if (!existingItem) {
      await repository.createNewsItem(item);
      newItemsCount++;
    }
  }
  return newItemsCount;
}

run();
