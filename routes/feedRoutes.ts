import { Router, Request, Response } from 'express';

const router = Router();

// GET /api/feed
router.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Feed endpoints',
    endpoints: ['GET /api/feed - list endpoints'],
  });
});

// POST /api/feed
router.post('/', async (req: Request, res: Response) => {
  try {
    console.log('Creating new feed');
  } catch (error) {
    res.status(500).json({
      error: 'Error creating feed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
