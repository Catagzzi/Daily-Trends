import { Page, Locator } from 'playwright';
import { Scraper } from './Scraper';
import { NewsItem } from '@appTypes/feed';

export class ElMundoScraper extends Scraper {
  sourceName = 'EL_MUNDO';
  url = process.env.EL_MUNDO_URL ?? null;

  protected async extractNews(page: Page): Promise<NewsItem[]> {
    console.log('Extracting news from El Mundo');
    const mainContentSelector = 'div[data-b-name="headlines_a"]';
    const mainContentLocator = page.locator(mainContentSelector);
    const articlesLocator = mainContentLocator.locator(
      'article[ue-article-id]'
    );
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
    const linkLocator = articleLocator.locator(
      'header > a.ue-c-cover-content__link'
    );
    const titleLocator = articleLocator.locator(
      'h2.ue-c-cover-content__headline'
    );
    const detailsLocator = articleLocator.locator(
      'div.ue-c-cover-content__list-inline'
    );
    const authorLocator = detailsLocator.locator('a.ue-c-cover-content__link');
    const placeLocator = detailsLocator.locator(
      'span.ue-c-cover-content__byline-location'
    );

    // main data
    const articleId =
      (await articleLocator.getAttribute('ue-article-id')) ?? null;
    const title = (await titleLocator.textContent()) ?? null;
    const link = (await linkLocator.first().getAttribute('href')) ?? null;
    if (!title || !link || !articleId) {
      return null;
    }

    // additional data
    let authorName: string | null = null;
    let authorLink: string | null = null;
    let place: string | null = null;

    if ((await authorLocator.count()) > 0) {
      authorName = (await authorLocator.first().textContent()) ?? null;
      authorLink = (await authorLocator.first().getAttribute('href')) ?? null;
    }

    if ((await placeLocator.count()) > 0) {
      place = (await placeLocator.first().textContent()) ?? null;
    }

    // format data
    const articleData: NewsItem = {
      title,
      link,
      articleId,
      source: this.sourceName,
    };
    if (authorName) articleData.author = authorName;
    if (authorLink) articleData.authorLink = authorLink;
    if (place) articleData.place = place;

    return articleData;
  }
}
