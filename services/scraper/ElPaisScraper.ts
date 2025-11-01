import { Page, Locator } from 'playwright';
import { Scraper } from './Scraper';
import { NewsItem } from '@appTypes/feed';

export class ElPaisScraper extends Scraper {
  sourceName = 'EL_PAIS';
  url = process.env.EL_PAIS_URL ?? null;

  protected async extractNews(page: Page): Promise<NewsItem[]> {
    console.log('Extracting news from El Pais');
    const mainSectionLocator = page.locator(
      'section[data-dtm-region="portada_apertura"]'
    );

    const articlesLocator = mainSectionLocator.locator('article');

    const newsItems: NewsItem[] = [];
    await Promise.all(
      (await articlesLocator.all()).map(async (articleLocator) => {
        const articleData = await this.extractArticleData(articleLocator);
        if (articleData) {
          newsItems.push(articleData);
        }
      })
    );

    return newsItems;
  }

  private async extractArticleData(
    articleLocator: Locator
  ): Promise<NewsItem | null> {
    // locators
    const titleLocator = articleLocator.locator('h2 > a');
    const descriptionLocator = articleLocator.locator('p.c_d');
    const authorLocator = articleLocator.locator('div > a');
    const placeLocator = articleLocator.locator('div > span.c_a_l');

    // main data
    const title = (await titleLocator.textContent()) ?? null;
    const link = (await titleLocator.getAttribute('href')) ?? null;
    if (!title || !link) {
      return null;
    }
    // additional data
    let description: string | null = null;
    let author: string | null = null;
    let authorLink: string | null = null;
    let place: string | null = null;

    if ((await descriptionLocator.count()) > 0) {
      description = (await descriptionLocator.first().textContent()) ?? null;
    }
    if ((await authorLocator.count()) > 0) {
      author = (await authorLocator.first().textContent()) ?? null;
      authorLink = (await authorLocator.first().getAttribute('href')) ?? null;
    }
    if ((await placeLocator.count()) > 0) {
      place = (await placeLocator.first().textContent()) ?? null;
    }

    // format data
    const articleData: NewsItem = {
      title,
      link,
      source: this.sourceName,
    };
    if (description) articleData.description = description;
    if (author) articleData.author = author;
    if (authorLink) articleData.authorLink = authorLink;
    if (place) articleData.place = place;

    return articleData;
  }
}
