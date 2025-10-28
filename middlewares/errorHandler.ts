import { Request, Response } from 'express';

interface CustomError extends Error {
  statusCode?: number;
  status?: string;
}

export const errorHandler = (err: CustomError, req: Request, res: Response) => {
  const statusCode = err.statusCode ?? 500;
  const status = err.status || 'error';

  console.error('Error:', {
    message: err.message,
    statusCode,
  });

  res.status(statusCode).json({
    status,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'dev' && { stack: err.stack }),
  });
};
