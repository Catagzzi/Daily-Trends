import { Request, Response, NextFunction } from 'express';
import { FeedController } from './FeedController';
import { FeedService } from '../services/feed/FeedService';
import { BadRequestError } from '@utils/errors';

jest.mock('../services/feed/FeedService');

type TestNewsItem = {
  title: string;
  link: string;
  source: string;
  _id?: string;
  description?: string;
  author?: string;
  authorLink?: string;
  place?: string;
  createdAt?: Date;
};

type TestFeedResponse = {
  newsItems: TestNewsItem[];
  pagination: {
    currentPage: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

describe('FeedController', () => {
  let controller: FeedController;
  let mockFeedService: jest.Mocked<FeedService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    // Mock FeedService methods
    mockFeedService = {
      getFeed: jest.fn(),
      createNewsItem: jest.fn(),
      getNewsItem: jest.fn(),
      deleteNewsItem: jest.fn(),
      updateNewsItem: jest.fn(),
    } as unknown as jest.Mocked<FeedService>;

    // Create controller and inject mock service
    controller = new FeedController();
    Object.defineProperty(controller, 'feedService', {
      value: mockFeedService,
      writable: false,
    });

    // Mock Express objects
    mockRequest = {
      query: {},
      params: {},
      body: {},
    };

    mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();

    jest.clearAllMocks();
  });

  describe('getFeed', () => {
    it('should return feed with default pagination', async () => {
      const mockFeedData: TestFeedResponse = {
        newsItems: [
          { _id: '1', title: 'News 1', link: 'https://example.com/1', source: 'EL_PAIS' },
          { _id: '2', title: 'News 2', link: 'https://example.com/2', source: 'EL_MUNDO' },
        ],
        pagination: {
          currentPage: 1,
          limit: 5,
          totalPages: 2,
          hasNextPage: true,
          hasPreviousPage: false,
        },
      };

      mockRequest.query = { date: '2024-01-15' };
      mockFeedService.getFeed.mockResolvedValue(mockFeedData as any);

      await controller.getFeed(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockFeedService.getFeed).toHaveBeenCalledWith('2024-01-15', 1, 5);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'success',
        data: mockFeedData,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle errors by calling next', async () => {
      const error = new BadRequestError('Invalid date');
      mockRequest.query = { date: 'invalid' };
      mockFeedService.getFeed.mockRejectedValue(error);

      await controller.getFeed(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  describe('createNewsItem', () => {
    it('should create a news item and return 201 status', async () => {
      const newsItemData = {
        title: 'New Article',
        link: 'https://example.com/new',
        source: 'EL_PAIS',
      };

      const createdItem: TestNewsItem = {
        ...newsItemData,
        _id: '123',
        createdAt: new Date(),
      };

      mockRequest.body = newsItemData;
      mockFeedService.createNewsItem.mockResolvedValue(createdItem as any);

      await controller.createNewsItem(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockFeedService.createNewsItem).toHaveBeenCalledWith(newsItemData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'success',
        data: createdItem,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle duplicate link error', async () => {
      const error = new BadRequestError('Article link already exists');
      mockRequest.body = {
        title: 'Duplicate',
        link: 'https://example.com/duplicate',
        source: 'EL_PAIS',
      };
      mockFeedService.createNewsItem.mockRejectedValue(error);

      await controller.createNewsItem(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });
});

