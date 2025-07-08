import { Document, Schema } from 'mongoose';

export interface ICategory {
  name: string;
  isHidden: boolean;
}

export interface IExternalAPISource {
  name: string;
  apiKey: string;
  status: 'Active' | 'Not Active';
  lastAccessed?: Date;
}

export interface IArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: Date;
  likes: number;
  dislikes: number;
  isHidden: boolean;
  reportCount: number;
  categoryId: Schema.Types.ObjectId | ICategoryDocument; 
  sourceId: Schema.Types.ObjectId | IExternalAPISourceDocument;
}

export interface ICategoryDocument extends ICategory, Document {}
export interface IExternalAPISourceDocument extends IExternalAPISource, Document {}
export interface IArticleDocument extends IArticle, Document {}

export interface HeadlineFilters {
  category?: string;
  startDate?: string;
  endDate?: string;
}

export interface SearchFilters extends HeadlineFilters {
  query?: string;
  sortBy?: 'publishedAt' | 'likes' | 'dislikes';
  ParsedQs? : string
}