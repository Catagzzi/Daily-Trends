export interface ArticleData {
  title: string;
  link: string;
  description?: string;
  author?: string;
  place?: string;
}
export interface NewsItem extends ArticleData {
  source: string;
}

export interface Feed {
  newsItems: NewsItem[];
  fetchedAt: Date;
  totalItems: number;
}
