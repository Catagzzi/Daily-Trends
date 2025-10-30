export interface NewsItem {
  id: string;
  title: string;
  description: string;
  publishedAt: Date;
  source?: string;
}

export interface Feed {
  source: string;
  newsItems: NewsItem[];
  fetchedAt: Date;
  totalItems: number;
}
