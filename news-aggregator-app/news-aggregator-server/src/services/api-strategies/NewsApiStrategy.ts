import { INewsApiStrategy } from './INewsApiStrategy';
import { IExternalAPISourceDocument, IArticle } from '../../types/news.types';

export class NewsApiStrategy implements INewsApiStrategy {
  public buildUrl(source: IExternalAPISourceDocument): string {
    return `https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=${source.apiKey}`;
  }

  public normalizeResponse(article: any): (Partial<IArticle> & { categoryName: string }) | null {
    if (!article.title || !article.url || article.title === '[Removed]') {
      return null;
    }
    return {
      title: article.title,
      description: article.description || article.title,
      url: article.url,
      publishedAt: new Date(article.publishedAt),
      categoryName: 'Business', 
    };
  }
}