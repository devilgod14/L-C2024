import { IArticleApiResponse } from "./news.types";

export interface ISavedArticleApiResponse {
  _id: string;
  userId: string;
  articleId: IArticleApiResponse;
  createdAt: string;
}