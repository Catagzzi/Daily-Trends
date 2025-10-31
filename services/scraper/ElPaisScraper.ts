import { Page, Locator } from 'playwright';
import { Scraper } from './Scraper';
import { NewsItem, ArticleData } from '@appTypes/feed';

export class ElPaisScraper extends Scraper {
  sourceName = 'EL_PAIS';
  url = process.env.EL_PAIS_URL ?? null;

  protected async extractNews(page: Page): Promise<NewsItem[]> {
    await page.waitForSelector('#main-content');

    const mainSectionLocator = page.locator(
      'section[data-dtm-region="portada_apertura"]'
    );

    const articlesLocator = mainSectionLocator.locator('article');

    const newsItems: NewsItem[] = [];
    await Promise.all(
      (await articlesLocator.all()).map(async (articleLocator) => {
        const articleData = await this.extractArticleData(articleLocator);
        if (articleData) {
          newsItems.push(this.formatData(articleData));
        }
      })
    );

    return newsItems;
  }

  private async extractArticleData(
    articleLocator: Locator
  ): Promise<ArticleData | null> {
    // locators
    const titleLocator = articleLocator.locator('h2 > a');
    const descriptionLocator = articleLocator.locator('p.c_d');
    const authorLocator = articleLocator.locator('div > a');
    const placeLocator = articleLocator.locator('div > span.c_a_l');
    // TODO: image

    // data
    const title = (await titleLocator.textContent()) ?? null;
    const link = (await titleLocator.getAttribute('href')) ?? null;

    let description: string | null = null;
    let author: string | null = null;
    let place: string | null = null;
    if ((await descriptionLocator.count()) > 0) {
      description = (await descriptionLocator.first().textContent()) ?? null;
    }
    if ((await authorLocator.count()) > 0) {
      author = (await authorLocator.first().textContent()) ?? null;
    }
    if ((await placeLocator.count()) > 0) {
      place = (await placeLocator.first().textContent()) ?? null;
    }
    if (!title || !link) {
      return null;
    }

    // format data
    const articleData: ArticleData = { title, link };
    if (description) articleData.description = description;
    if (author) articleData.author = author;
    if (place) articleData.place = place;

    return articleData;
  }
}
