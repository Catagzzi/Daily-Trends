import { mongoDB } from '../../config/database';
import { FeedRepository } from '../../repositories/FeedRepository';
import { ElPaisScraper } from './ElPaisScraper';

const run = async () => {
  let newItemsCount = 0;
  try {
    await mongoDB.connect();
    console.log('Database connected');

    const repository = new FeedRepository();
    const elPaisScraper = new ElPaisScraper();

    console.log(`Running scraper ${elPaisScraper.sourceName}`);
    const newsItems = await elPaisScraper.run();

    if (newsItems.length > 0) {
      console.log('Check items and save in mongo');
      for (const item of newsItems) {
        const existingItem = await repository.findByLink(item.link);
        if (!existingItem) {
          await repository.createNewsItem(item);
          newItemsCount++;
        }
      }
    }
    console.log(`Successfully saved ${newItemsCount} items`);
  } catch (error) {
    console.error('Error in scraper: ', error);
    process.exit(1);
  } finally {
    await mongoDB.disconnect();
    console.log('Database disconnected');
    process.exit(0);
  }
};

run();
