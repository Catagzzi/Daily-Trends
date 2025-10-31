import { BrowserManager } from '@utils/BrowserManager';
import { Page } from 'playwright';
import { NewsItem, ArticleData } from '@appTypes/feed';

export abstract class Scraper {
  abstract sourceName: string;
  abstract url: string | null;

  protected browserManager: BrowserManager;

  constructor() {
    this.browserManager = new BrowserManager();
  }

  public async run(): Promise<NewsItem[]> {
    try {
      if (!this.url) {
        throw new Error(`URL for ${this.sourceName} is not defined`);
      }
      const page = await this.browserManager.newPage();
      await page.goto(this.url, { waitUntil: 'domcontentloaded' });
      return await this.extractNews(page);
    } finally {
      await this.browserManager.close();
    }
  }

  protected abstract extractNews(page: Page): Promise<NewsItem[]>;

  protected formatData(data: ArticleData): NewsItem {
    const item: NewsItem = {
      ...data,
      source: this.sourceName,
    };
    return item;
  }
}
