import express, { Application, Request, Response } from 'express';
import { errorHandler } from './middlewares/errorHandler';
import { logger } from './middlewares/logger';
import feedRoutes from './routes/feedRoutes';
import 'dotenv/config';

const app: Application = express();

// middlewares
app.use(express.json());
app.use(logger);

// root
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Avantio API - Scraper Service',
    version: '1.0.0',
    status: 'running',
  });
});

// health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// scraper routes
app.use('/api/feed', feedRoutes);

// not found
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
  });
});

// middleware error handler
app.use(errorHandler);

export default app;
