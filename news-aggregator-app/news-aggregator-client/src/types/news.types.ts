export interface IArticleApiResponse {
  _id: string;
  title: string;
  description: string;
  url: string;
  publishedAt: string; // Dates are often strings in JSON
  likes: number;
  dislikes: number;
  categoryId: {
    _id: string;
    name: string;
  };
  sourceId: {
    _id: string;
    name: string;
  };
}
