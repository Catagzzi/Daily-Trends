import { Router } from 'express';
import { FeedController } from '../controllers/FeedController';

const router = Router();
const feedController = new FeedController();

// GET /api/feed
router.get('/', feedController.getFeed);

// POST /api/feed
router.post('/', feedController.createFeed);

export default router;
