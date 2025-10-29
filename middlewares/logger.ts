import { Request, Response, NextFunction } from 'express';

export const logger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();
  const { method, originalUrl } = req;

  console.log(`[${timestamp}] INFO: ${method} ${originalUrl}`);

  res.on('finish', () => {
    const duration = Date.now() - start;
    const endTimestamp = new Date().toISOString();
    const { statusCode } = res;

    const logMessage = `[${endTimestamp}] INFO: ${method} ${originalUrl} ${statusCode} - ${duration}ms`;

    console.log(logMessage);
  });

  next();
};
