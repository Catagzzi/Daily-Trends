jest.mock('playwright', () => ({
  chromium: {},
  Browser: {},
  Page: {},
  Locator: {},
}));

jest.mock('@utils/BrowserManager', () => ({
  BrowserManager: jest.fn().mockImplementation(() => ({
    newPage: jest.fn(),
    close: jest.fn(),
  })),
}));

import { Page, Locator } from 'playwright';
import { ElMundoScraper } from './ElMundoScraper';
import {
  setupScraperTest,
  createElMundoMockArticleLocator,
} from './__tests__/scraperTestUtils';

describe('ElMundoScraper', () => {
  let scraper: ElMundoScraper;
  let mockBrowserManager: any;
  let mockPage: jest.Mocked<Page>;

  beforeEach(() => {
    process.env.EL_MUNDO_URL = 'https://www.elmundo.es';

    const setup = setupScraperTest();
    mockPage = setup.mockPage;
    mockBrowserManager = setup.mockBrowserManager;

    scraper = new ElMundoScraper();
    Object.defineProperty(scraper, 'browserManager', {
      value: mockBrowserManager,
      writable: false,
    });

    jest.clearAllMocks();
  });

  describe('run', () => {
    it('should extract news items successfully', async () => {
      const mockArticleLocator = createElMundoMockArticleLocator({
        articleId: 'article-123',
        title: 'Test Article',
        link: 'https://www.elmundo.es/test-article',
        authorName: 'John Doe',
        authorLink: 'https://www.elmundo.es/john-doe',
        place: 'Madrid',
      });

      const mockMainContentLocator = {
        locator: jest.fn().mockReturnValue({
          all: jest.fn().mockResolvedValue([mockArticleLocator]),
        }),
      } as unknown as Locator;

      mockPage.locator = jest.fn().mockReturnValue(mockMainContentLocator);
      mockBrowserManager.newPage.mockResolvedValue(mockPage);

      const result = await scraper.run();

      expect(mockBrowserManager.newPage).toHaveBeenCalled();
      expect(mockPage.goto).toHaveBeenCalledWith('https://www.elmundo.es', {
        waitUntil: 'domcontentloaded',
      });
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        title: 'Test Article',
        link: 'https://www.elmundo.es/test-article',
        articleId: 'article-123',
        source: 'EL_MUNDO',
        author: 'John Doe',
        authorLink: 'https://www.elmundo.es/john-doe',
        place: 'Madrid',
      });
      expect(mockBrowserManager.close).toHaveBeenCalled();
    });

    it('should throw error when URL is not defined', async () => {
      scraper.url = null;

      await expect(scraper.run()).rejects.toThrow(
        'URL for EL_MUNDO is not defined'
      );
      expect(mockBrowserManager.close).toHaveBeenCalled();
    });

    it('should close browser even when navigation fails', async () => {
      const error = new Error('Navigation failed');
      mockBrowserManager.newPage.mockResolvedValue(mockPage);
      mockPage.goto = jest.fn().mockRejectedValue(error);

      await expect(scraper.run()).rejects.toThrow('Navigation failed');
      expect(mockBrowserManager.close).toHaveBeenCalled();
    });
  });

  describe('extractNews', () => {
    it('should extract multiple news items', async () => {
      const mockArticleLocator1 = createElMundoMockArticleLocator({
        articleId: 'article-1',
        title: 'First Article',
        link: 'https://www.elmundo.es/first',
      });

      const mockArticleLocator2 = createElMundoMockArticleLocator({
        articleId: 'article-2',
        title: 'Second Article',
        link: 'https://www.elmundo.es/second',
        place: 'Barcelona',
      });

      const mockMainContentLocator = {
        locator: jest.fn().mockReturnValue({
          all: jest
            .fn()
            .mockResolvedValue([mockArticleLocator1, mockArticleLocator2]),
        }),
      } as unknown as Locator;

      mockPage.locator = jest.fn().mockReturnValue(mockMainContentLocator);

      const result = await (scraper as any).extractNews(mockPage);

      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('First Article');
      expect(result[1].title).toBe('Second Article');
    });

    it('should filter articles with missing required fields', async () => {
      const validArticle = createElMundoMockArticleLocator({
        articleId: 'article-1',
        title: 'Valid Article',
        link: 'https://www.elmundo.es/valid',
      });

      const invalidArticle = createElMundoMockArticleLocator({
        articleId: 'article-2',
        title: null,
        link: 'https://www.elmundo.es/invalid',
      });

      const mockMainContentLocator = {
        locator: jest.fn().mockReturnValue({
          all: jest.fn().mockResolvedValue([validArticle, invalidArticle]),
        }),
      } as unknown as Locator;

      mockPage.locator = jest.fn().mockReturnValue(mockMainContentLocator);

      const result = await (scraper as any).extractNews(mockPage);

      expect(result).toHaveLength(1);
    });

    it('should return empty array when no articles found', async () => {
      const mockMainContentLocator = {
        locator: jest.fn().mockReturnValue({
          all: jest.fn().mockResolvedValue([]),
        }),
      } as unknown as Locator;

      mockPage.locator = jest.fn().mockReturnValue(mockMainContentLocator);

      const result = await (scraper as any).extractNews(mockPage);

      expect(result).toHaveLength(0);
    });
  });

  describe('extractArticleData', () => {
    it('should extract complete article data', async () => {
      const mockArticleLocator = createElMundoMockArticleLocator({
        articleId: 'article-123',
        title: 'Complete Article',
        link: 'https://www.elmundo.es/complete',
        authorName: 'Jane Doe',
        authorLink: 'https://www.elmundo.es/jane-doe',
        place: 'Valencia',
      });

      const result = await (scraper as any).extractArticleData(
        mockArticleLocator
      );

      expect(result).toEqual({
        title: 'Complete Article',
        link: 'https://www.elmundo.es/complete',
        articleId: 'article-123',
        source: 'EL_MUNDO',
        author: 'Jane Doe',
        authorLink: 'https://www.elmundo.es/jane-doe',
        place: 'Valencia',
      });
    });

    it('should extract article without optional fields', async () => {
      const mockArticleLocator = createElMundoMockArticleLocator({
        articleId: 'article-456',
        title: 'Basic Article',
        link: 'https://www.elmundo.es/basic',
      });

      const result = await (scraper as any).extractArticleData(
        mockArticleLocator
      );

      expect(result).toEqual({
        title: 'Basic Article',
        link: 'https://www.elmundo.es/basic',
        articleId: 'article-456',
        source: 'EL_MUNDO',
      });
    });

    it('should return null when title is missing', async () => {
      const mockArticleLocator = createElMundoMockArticleLocator({
        articleId: 'article-789',
        title: null,
        link: 'https://www.elmundo.es/no-title',
      });

      const result = await (scraper as any).extractArticleData(
        mockArticleLocator
      );

      expect(result).toBeNull();
    });

    it('should return null when link is missing', async () => {
      const mockArticleLocator = createElMundoMockArticleLocator({
        articleId: 'article-789',
        title: 'No Link Article',
        link: null,
      });

      const result = await (scraper as any).extractArticleData(
        mockArticleLocator
      );

      expect(result).toBeNull();
    });

    it('should return null when articleId is missing', async () => {
      const mockArticleLocator = createElMundoMockArticleLocator({
        articleId: null,
        title: 'No ID Article',
        link: 'https://www.elmundo.es/no-id',
      });

      const result = await (scraper as any).extractArticleData(
        mockArticleLocator
      );

      expect(result).toBeNull();
    });
  });
});
