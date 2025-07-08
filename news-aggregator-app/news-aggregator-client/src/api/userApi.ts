import { BaseApiService } from "./baseApiservice";
class UserApi extends BaseApiService {
  public async saveArticle(articleId: string): Promise<any> {
    const { data } = await this.api.post('/users/me/saved-articles', { articleId });
    return data;
  }

  public async getSavedArticles(): Promise<any[]> {
    const { data } = await this.api.get('/users/me/saved-articles');
    return data;
  }

  public async deleteSavedArticle(savedArticleId: string): Promise<any> {
    const { data } = await this.api.delete(`/users/me/saved-articles/${savedArticleId}`);
    return data;
  }

  public async voteOnArticle(articleId: string, vote: 'like' | 'dislike'): Promise<any> {
    const { data } = await this.api.post(`/articles/${articleId}/vote`, { vote });
    return data;
  }

  public async reportArticle(articleId: string): Promise<any> {
    const { data } = await this.api.post(`/articles/${articleId}/report`);
    return data;
  }
}

export default new UserApi();