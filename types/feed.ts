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
