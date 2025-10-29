import express, { Application, Request, Response, NextFunction } from 'express';
import { errorHandler } from './middlewares/errorHandler';
import { logger } from './middlewares/logger';
import { NotFoundError } from '@utils/errors';
import feedRoutes from './routes/feedRoutes';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config';

const app: Application = express();

//middlewares
app.use(helmet());
app.use(cors());
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

// feed routes
app.use('/api/feed', feedRoutes);

// not found
app.use('*', (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError(`Route not found: ${req.path}`));
});

// middleware error handler
app.use(errorHandler);

export default app;
