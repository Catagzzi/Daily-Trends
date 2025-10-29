import { Router } from 'express';
import { FeedController } from '../controllers/FeedController';
import { authenticate } from '../middlewares/auth';
import { validateGetFeed, validateCreateNews } from '../middlewares/validation';

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

export default router;
