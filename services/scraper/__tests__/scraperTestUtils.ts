import { Page, Locator } from 'playwright';

export function setupScraperTest() {
  const mockPage = {
    goto: jest.fn(),
    locator: jest.fn(),
  } as unknown as jest.Mocked<Page>;

  const mockBrowserManager = {
    newPage: jest.fn().mockResolvedValue(mockPage),
    close: jest.fn(),
  };

  return { mockPage, mockBrowserManager };
}

export interface BaseMockArticleConfig {
  title: string | null;
  link: string | null;
  description?: string | null;
  authorName?: string | null;
  authorLink?: string | null;
  place?: string | null;
}

export interface ElMundoMockArticleConfig extends BaseMockArticleConfig {
  articleId: string | null;
}

export type ElPaisMockArticleConfig = BaseMockArticleConfig;

export function createElMundoMockArticleLocator(
  data: ElMundoMockArticleConfig
): jest.Mocked<Locator> {
  const mockLinkLocator = {
    first: jest.fn().mockReturnValue({
      getAttribute: jest.fn().mockResolvedValue(data.link),
    }),
  };

  const mockTitleLocator = {
    textContent: jest.fn().mockResolvedValue(data.title),
  };

  const mockAuthorLocator = {
    count: jest.fn().mockResolvedValue(data.authorName ? 1 : 0),
    first: jest.fn().mockReturnValue({
      textContent: jest.fn().mockResolvedValue(data.authorName ?? null),
      getAttribute: jest.fn().mockResolvedValue(data.authorLink ?? null),
    }),
  };

  const mockPlaceLocator = {
    count: jest.fn().mockResolvedValue(data.place ? 1 : 0),
    first: jest.fn().mockReturnValue({
      textContent: jest.fn().mockResolvedValue(data.place ?? null),
    }),
  };

  const mockDetailsLocator = {
    locator: jest.fn((selector: string) => {
      if (selector.includes('ue-c-cover-content__link')) {
        return mockAuthorLocator;
      }
      if (selector.includes('ue-c-cover-content__byline-location')) {
        return mockPlaceLocator;
      }
      return null;
    }),
  };

  const mockArticleLocator = {
    getAttribute: jest.fn((attr: string) => {
      if (attr === 'ue-article-id') {
        return Promise.resolve(data.articleId);
      }
      return Promise.resolve(null);
    }),
    locator: jest.fn((selector: string) => {
      if (selector.includes('ue-c-cover-content__link')) {
        return mockLinkLocator;
      }
      if (selector.includes('ue-c-cover-content__headline')) {
        return mockTitleLocator;
      }
      if (selector.includes('ue-c-cover-content__list-inline')) {
        return mockDetailsLocator;
      }
      return null;
    }),
  } as unknown as jest.Mocked<Locator>;

  return mockArticleLocator;
}

export function createElPaisMockArticleLocator(
  data: ElPaisMockArticleConfig
): jest.Mocked<Locator> {
  const mockTitleLocator = {
    textContent: jest.fn().mockResolvedValue(data.title),
    getAttribute: jest.fn().mockResolvedValue(data.link),
  };

  const mockDescriptionLocator = {
    count: jest.fn().mockResolvedValue(data.description ? 1 : 0),
    first: jest.fn().mockReturnValue({
      textContent: jest.fn().mockResolvedValue(data.description ?? null),
    }),
  };

  const mockAuthorLocator = {
    count: jest.fn().mockResolvedValue(data.authorName ? 1 : 0),
    first: jest.fn().mockReturnValue({
      textContent: jest.fn().mockResolvedValue(data.authorName ?? null),
      getAttribute: jest.fn().mockResolvedValue(data.authorLink ?? null),
    }),
  };

  const mockPlaceLocator = {
    count: jest.fn().mockResolvedValue(data.place ? 1 : 0),
    first: jest.fn().mockReturnValue({
      textContent: jest.fn().mockResolvedValue(data.place ?? null),
    }),
  };

  const mockArticleLocator = {
    locator: jest.fn((selector: string) => {
      if (selector === 'h2 > a') {
        return mockTitleLocator;
      }
      if (selector === 'p.c_d') {
        return mockDescriptionLocator;
      }
      if (selector === 'div > a') {
        return mockAuthorLocator;
      }
      if (selector === 'div > span.c_a_l') {
        return mockPlaceLocator;
      }
      return null;
    }),
  } as unknown as jest.Mocked<Locator>;

  return mockArticleLocator;
}
