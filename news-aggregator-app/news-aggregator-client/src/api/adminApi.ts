import { BaseApiService } from "./baseApiservice";

class AdminApi extends BaseApiService {
  // --- Source Management ---
  public async getSources(): Promise<any[]> {
    const { data } = await this.api.get('/admin/sources');
    return data;
  }

  public async getSourceDetails(sourceId: string): Promise<any> {
    const { data } = await this.api.get(`/admin/sources/${sourceId}`);
    return data;
  }

  public async updateSourceApiKey(sourceId: string, apiKey: string): Promise<any> {
    const { data } = await this.api.put(`/admin/sources/${sourceId}`, { apiKey });
    return data;
  }

  // --- Category Management ---
  public async addCategory(categoryName: string): Promise<any> {
    const { data } = await this.api.post('/admin/categories', { name: categoryName });
    return data;
  }

  public async hideCategory(categoryId: string): Promise<any> {
    const { data } = await this.api.put(`/admin/categories/${categoryId}/hide`);
    return data;
  }

  public async unhideCategory(categoryId: string): Promise<any> {
    const { data } = await this.api.put(`/admin/categories/${categoryId}/unhide`);
    return data;
  }

  // --- Report & Article Moderation ---
  public async getReportedArticles(): Promise<any[]> {
    const { data } = await this.api.get('/admin/reports');
    return data;
  }

  public async hideArticle(articleId: string): Promise<any> {
    const { data } = await this.api.put(`/admin/articles/${articleId}/hide`);
    return data;
  }

  public async unhideArticle(articleId: string): Promise<any> {
    const { data } = await this.api.put(`/admin/articles/${articleId}/unhide`);
    return data;
  }

  // --- Blocked Keyword Management ---
  public async getBlockedKeywords(): Promise<any[]> {
    const { data } = await this.api.get('/admin/keywords');
    return data;
  }

  public async addBlockedKeyword(keyword: string): Promise<any> {
    const { data } = await this.api.post('/admin/keywords', { keyword });
    return data;
  }

  public async removeBlockedKeyword(keywordId: string): Promise<any> {
    const { data } = await this.api.delete(`/admin/keywords/${keywordId}`);
    return data;
  }
}

export default new AdminApi();