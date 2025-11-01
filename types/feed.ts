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
