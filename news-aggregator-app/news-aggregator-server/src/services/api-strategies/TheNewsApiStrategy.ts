import { INewsApiStrategy } from './INewsApiStrategy';
import { IExternalAPISourceDocument, IArticle } from '../../types/news.types';

export class TheNewsApiStrategy implements INewsApiStrategy {
  public buildUrl(source: IExternalAPISourceDocument): string {
    return `https://api.thenewsapi.com/v1/news/top?api_token=${source.apiKey}&locale=us&limit=5`;
  }

  public normalizeResponse(article: any): (Partial<IArticle> & { categoryName: string }) | null {
    if (!article.title || !article.url) {
      return null;
    }
    return {
      title: article.title,
      description: article.snippet || article.description || article.title,
      url: article.url,
      publishedAt: new Date(article.published_at),
      categoryName: article.categories.length > 0 ? article.categories[0] : 'General',
    };
  }
}