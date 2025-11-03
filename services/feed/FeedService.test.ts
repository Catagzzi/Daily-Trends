import { FeedService } from './FeedService';
import { FeedRepository } from '../../repositories/FeedRepository';
import { BadRequestError } from '@utils/errors';
import { NewsItem } from '@appTypes/feed';

jest.mock('../../repositories/FeedRepository');

describe('FeedService', () => {
  let service: FeedService;
  let mockRepository: jest.Mocked<FeedRepository>;

  beforeEach(() => {
    mockRepository = new FeedRepository() as jest.Mocked<FeedRepository>;
    service = new FeedService();

    Object.defineProperty(service, 'repository', {
      value: mockRepository,
      writable: false,
    });

    jest.clearAllMocks();
  });

  describe('getFeed', () => {
    it('should return feed with pagination', async () => {
      const mockItems = [
        { _id: '1', title: 'News 1', link: 'https://example.com/1' },
        { _id: '2', title: 'News 2', link: 'https://example.com/2' },
      ];

      mockRepository.getFeedByDate = jest.fn().mockResolvedValue({
        items: mockItems,
        total: 10,
      });

      const result = await service.getFeed('2024-01-15', 1, 5);

      expect(result).toEqual({
        newsItems: mockItems,
        pagination: {
          currentPage: 1,
          limit: 5,
          totalPages: 2,
          hasNextPage: true,
          hasPreviousPage: false,
        },
      });
      expect(mockRepository.getFeedByDate).toHaveBeenCalledWith(
        '2024-01-15',
        1,
        5
      );
    });

    it('should handle empty results', async () => {
      mockRepository.getFeedByDate = jest.fn().mockResolvedValue({
        items: [],
        total: 0,
      });

      const result = await service.getFeed('2024-01-15', 1, 5);

      expect(result.newsItems).toEqual([]);
      expect(result.pagination.totalPages).toBe(0);
    });
  });

  describe('createNewsItem', () => {
    it('should create a news item if link does not exist', async () => {
      const mockNewsItem: NewsItem = {
        title: 'Test',
        link: 'https://example.com/test',
        source: 'EL_PAIS',
      };

      const mockCreatedItem = {
        ...mockNewsItem,
        _id: '123',
        createdAt: new Date(),
      };

      mockRepository.findByLink = jest.fn().mockResolvedValue(null);
      mockRepository.createNewsItem = jest
        .fn()
        .mockResolvedValue(mockCreatedItem);

      const result = await service.createNewsItem(mockNewsItem);

      expect(mockRepository.findByLink).toHaveBeenCalledWith(mockNewsItem.link);
      expect(mockRepository.createNewsItem).toHaveBeenCalledWith(mockNewsItem);
      expect(result).toEqual(mockCreatedItem);
    });

    it('should throw error if link already exists', async () => {
      const mockNewsItem: NewsItem = {
        title: 'Test',
        link: 'https://example.com/test',
        source: 'EL_PAIS',
      };

      mockRepository.findByLink = jest.fn().mockResolvedValue({
        _id: '123',
        title: 'Test',
        link: mockNewsItem.link,
      });

      await expect(service.createNewsItem(mockNewsItem)).rejects.toThrow(
        BadRequestError
      );
      expect(mockRepository.findByLink).toHaveBeenCalledWith(mockNewsItem.link);
      expect(mockRepository.createNewsItem).not.toHaveBeenCalled();
    });
  });

  describe('getNewsItem', () => {
    it('should return a news item by id', async () => {
      const mockId = '123456789012345678901234';
      const mockItem = {
        _id: mockId,
        title: 'Test',
        link: 'https://example.com/test',
      };

      mockRepository.findById = jest.fn().mockResolvedValue(mockItem);

      const result = await service.getNewsItem(mockId);

      expect(mockRepository.findById).toHaveBeenCalledWith(mockId);
      expect(result).toEqual(mockItem);
    });

    it('should throw error if news item not found', async () => {
      const mockId = '123456789012345678901234';

      mockRepository.findById = jest.fn().mockResolvedValue(null);

      await expect(service.getNewsItem(mockId)).rejects.toThrow(
        BadRequestError
      );
    });
  });

  describe('deleteNewsItem', () => {
    it('should delete a news item by id', async () => {
      const mockId = '123456789012345678901234';
      const mockItem = {
        _id: mockId,
        title: 'Test',
        link: 'https://example.com/test',
      };

      mockRepository.findById = jest.fn().mockResolvedValue(mockItem);
      mockRepository.deleteById = jest.fn().mockResolvedValue(undefined);

      await service.deleteNewsItem(mockId);

      expect(mockRepository.findById).toHaveBeenCalledWith(mockId);
      expect(mockRepository.deleteById).toHaveBeenCalledWith(mockId);
    });

    it('should throw error if news item not found', async () => {
      const mockId = '123456789012345678901234';

      mockRepository.findById = jest.fn().mockResolvedValue(null);

      await expect(service.deleteNewsItem(mockId)).rejects.toThrow(
        BadRequestError
      );
      expect(mockRepository.deleteById).not.toHaveBeenCalled();
    });
  });

  describe('updateNewsItem', () => {
    it('should update a news item', async () => {
      const mockId = '123456789012345678901234';
      const mockExisting = {
        _id: mockId,
        title: 'Old Title',
        link: 'https://example.com/test',
      };
      const updateData = { title: 'New Title' };
      const mockUpdated = {
        ...mockExisting,
        ...updateData,
      };

      mockRepository.findById = jest.fn().mockResolvedValue(mockExisting);
      mockRepository.updateById = jest.fn().mockResolvedValue(mockUpdated);

      const result = await service.updateNewsItem(mockId, updateData);

      expect(mockRepository.findById).toHaveBeenCalledWith(mockId);
      expect(mockRepository.updateById).toHaveBeenCalledWith(
        mockId,
        updateData
      );
      expect(result).toEqual(mockUpdated);
    });

    it('should throw error if news item not found', async () => {
      const mockId = '123456789012345678901234';

      mockRepository.findById = jest.fn().mockResolvedValue(null);

      await expect(
        service.updateNewsItem(mockId, { title: 'New' })
      ).rejects.toThrow(BadRequestError);
      expect(mockRepository.updateById).not.toHaveBeenCalled();
    });

    it('should throw error if new link already exists', async () => {
      const mockId = '123456789012345678901234';
      const mockExisting = {
        _id: mockId,
        title: 'Test',
        link: 'https://example.com/old',
      };
      const updateData = { link: 'https://example.com/new' };

      mockRepository.findById = jest.fn().mockResolvedValue(mockExisting);
      mockRepository.findByLink = jest.fn().mockResolvedValue({
        _id: 'different-id',
        title: 'Another',
        link: updateData.link,
      });

      await expect(service.updateNewsItem(mockId, updateData)).rejects.toThrow(
        BadRequestError
      );
      expect(mockRepository.updateById).not.toHaveBeenCalled();
    });
  });
});
