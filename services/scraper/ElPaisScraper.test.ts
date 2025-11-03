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
import { ElPaisScraper } from './ElPaisScraper';
import {
  setupScraperTest,
  createElPaisMockArticleLocator,
} from './__tests__/scraperTestUtils';

describe('ElPaisScraper', () => {
  let scraper: ElPaisScraper;
  let mockBrowserManager: any;
  let mockPage: jest.Mocked<Page>;

  beforeEach(() => {
    process.env.EL_PAIS_URL = 'https://elpais.com';

    const setup = setupScraperTest();
    mockPage = setup.mockPage;
    mockBrowserManager = setup.mockBrowserManager;

    scraper = new ElPaisScraper();
    Object.defineProperty(scraper, 'browserManager', {
      value: mockBrowserManager,
      writable: false,
    });

    jest.clearAllMocks();
  });

  describe('run', () => {
    it('should extract news items successfully', async () => {
      const mockArticleLocator = createElPaisMockArticleLocator({
        title: 'Test Article',
        link: 'https://elpais.com/test-article',
        description: 'Test description',
        authorName: 'John Doe',
        authorLink: 'https://elpais.com/john-doe',
        place: 'Madrid',
      });

      const mockMainSectionLocator = {
        locator: jest.fn().mockReturnValue({
          all: jest.fn().mockResolvedValue([mockArticleLocator]),
        }),
      } as unknown as Locator;

      mockPage.locator = jest.fn().mockReturnValue(mockMainSectionLocator);

      const result = await scraper.run();

      expect(mockBrowserManager.newPage).toHaveBeenCalled();
      expect(mockPage.goto).toHaveBeenCalledWith('https://elpais.com', {
        waitUntil: 'domcontentloaded',
      });
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        title: 'Test Article',
        link: 'https://elpais.com/test-article',
        source: 'EL_PAIS',
        description: 'Test description',
        author: 'John Doe',
        authorLink: 'https://elpais.com/john-doe',
        place: 'Madrid',
      });
      expect(mockBrowserManager.close).toHaveBeenCalled();
    });

    it('should throw error when URL is not defined', async () => {
      scraper.url = null;

      await expect(scraper.run()).rejects.toThrow(
        'URL for EL_PAIS is not defined'
      );
      expect(mockBrowserManager.close).toHaveBeenCalled();
    });

    it('should close browser even when navigation fails', async () => {
      const error = new Error('Navigation failed');
      mockPage.goto = jest.fn().mockRejectedValue(error);

      await expect(scraper.run()).rejects.toThrow('Navigation failed');
      expect(mockBrowserManager.close).toHaveBeenCalled();
    });
  });

  describe('extractNews', () => {
    it('should extract multiple news items', async () => {
      const mockArticleLocator1 = createElPaisMockArticleLocator({
        title: 'First Article',
        link: 'https://elpais.com/first',
      });

      const mockArticleLocator2 = createElPaisMockArticleLocator({
        title: 'Second Article',
        link: 'https://elpais.com/second',
        place: 'Barcelona',
      });

      const mockMainSectionLocator = {
        locator: jest.fn().mockReturnValue({
          all: jest
            .fn()
            .mockResolvedValue([mockArticleLocator1, mockArticleLocator2]),
        }),
      } as unknown as Locator;

      mockPage.locator = jest.fn().mockReturnValue(mockMainSectionLocator);

      const result = await (scraper as any).extractNews(mockPage);

      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('First Article');
      expect(result[1].title).toBe('Second Article');
      expect(result[1].place).toBe('Barcelona');
    });

    it('should filter out articles with missing required fields', async () => {
      const validArticle = createElPaisMockArticleLocator({
        title: 'Valid Article',
        link: 'https://elpais.com/valid',
      });

      const invalidArticle = createElPaisMockArticleLocator({
        title: null,
        link: 'https://elpais.com/invalid',
      });

      const mockMainSectionLocator = {
        locator: jest.fn().mockReturnValue({
          all: jest.fn().mockResolvedValue([validArticle, invalidArticle]),
        }),
      } as unknown as Locator;

      mockPage.locator = jest.fn().mockReturnValue(mockMainSectionLocator);

      const result = await (scraper as any).extractNews(mockPage);

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Valid Article');
    });

    it('should return empty array when no articles found', async () => {
      const mockMainSectionLocator = {
        locator: jest.fn().mockReturnValue({
          all: jest.fn().mockResolvedValue([]),
        }),
      } as unknown as Locator;

      mockPage.locator = jest.fn().mockReturnValue(mockMainSectionLocator);

      const result = await (scraper as any).extractNews(mockPage);

      expect(result).toHaveLength(0);
    });
  });

  describe('extractArticleData', () => {
    it('should extract complete article data', async () => {
      const mockArticleLocator = createElPaisMockArticleLocator({
        title: 'Complete Article',
        link: 'https://elpais.com/complete',
        description: 'Full description',
        authorName: 'Jane Doe',
        authorLink: 'https://elpais.com/jane-doe',
        place: 'Valencia',
      });

      const result = await (scraper as any).extractArticleData(
        mockArticleLocator
      );

      expect(result).toEqual({
        title: 'Complete Article',
        link: 'https://elpais.com/complete',
        source: 'EL_PAIS',
        description: 'Full description',
        author: 'Jane Doe',
        authorLink: 'https://elpais.com/jane-doe',
        place: 'Valencia',
      });
    });

    it('should extract article without optional fields', async () => {
      const mockArticleLocator = createElPaisMockArticleLocator({
        title: 'Basic Article',
        link: 'https://elpais.com/basic',
      });

      const result = await (scraper as any).extractArticleData(
        mockArticleLocator
      );

      expect(result).toEqual({
        title: 'Basic Article',
        link: 'https://elpais.com/basic',
        source: 'EL_PAIS',
      });
    });

    it('should return null when title is missing', async () => {
      const mockArticleLocator = createElPaisMockArticleLocator({
        title: null,
        link: 'https://elpais.com/no-title',
      });

      const result = await (scraper as any).extractArticleData(
        mockArticleLocator
      );

      expect(result).toBeNull();
    });

    it('should return null when link is missing', async () => {
      const mockArticleLocator = createElPaisMockArticleLocator({
        title: 'No Link Article',
        link: null,
      });

      const result = await (scraper as any).extractArticleData(
        mockArticleLocator
      );

      expect(result).toBeNull();
    });
  });
});
