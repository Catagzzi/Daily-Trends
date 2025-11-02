import { Router } from 'express';
import { FeedController } from '../controllers/FeedController';
import { authenticate } from '../middlewares/auth';
import { 
  validateGetFeed, 
  validateCreateNews,
  validateGetNews,
  validateUpdateNews
} from '../middlewares/validation';

const router = Router();
const feedController = new FeedController();

// GET /api/feed
router.get('/', authenticate, validateGetFeed, feedController.getFeed);

// POST /api/feed/news
router.post(
  '/news',
  authenticate,
  validateCreateNews,
  feedController.createNewsItem
);

// GET /api/feed/news/:id
router.get(
  '/news/:id',
  authenticate,
  validateGetNews,
  feedController.getNewsItem
);

// DELETE /api/feed/news/:id
router.delete(
  '/news/:id',
  authenticate,
  validateGetNews,
  feedController.deleteNewsItem
);

// PATCH /api/feed/news/:id
router.patch(
  '/news/:id',
  authenticate,
  validateUpdateNews,
  feedController.updateNewsItem
);

export default router;
