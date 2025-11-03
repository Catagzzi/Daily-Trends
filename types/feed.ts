import { z } from 'zod';

export interface NewsItem {
  title: string;
  link: string;
  articleId?: string;
  description?: string;
  author?: string;
  authorLink?: string;
  place?: string;
  source: string;
}
export interface Feed {
  newsItems: NewsItem[];
  fetchedAt: Date;
  totalItems: number;
}

export const getFeedSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD format'),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(5),
});

export const createNewsSchema = z.object({
  title: z.string().min(1),
  link: z.url(),
  articleId: z.string().optional(),
  description: z.string().optional(),
  author: z.string().optional(),
  authorLink: z.string().optional(),
  place: z.string().optional(),
  source: z.enum(['EL_PAIS', 'EL_MUNDO', 'DAILY_TRENDS']),
});

export const getNewsSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid mongoDB objectId format'),
});

export const updateNewsSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid mongoDB objectId format'),
  title: z.string().min(1).optional(),
  link: z.url().optional(),
  articleId: z.string().optional(),
  description: z.string().optional(),
  author: z.string().optional(),
  authorLink: z.string().optional(),
  place: z.string().optional(),
  source: z.enum(['EL_PAIS', 'EL_MUNDO', 'DAILY_TRENDS']).optional(),
});
