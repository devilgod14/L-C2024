import { IExternalAPISourceDocument, IArticle } from '../../types/news.types';

export interface INewsApiStrategy {
  buildUrl(source: IExternalAPISourceDocument): string;
  normalizeResponse(data: any): Partial<IArticle> & { categoryName: string } | null;
}