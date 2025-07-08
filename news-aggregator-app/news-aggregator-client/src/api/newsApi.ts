
import { HeadlineFilters, SearchFilters } from '../types/api.types';
import { BaseApiService } from './baseApiservice';
class NewsApi extends BaseApiService {
  public async getHeadlines(filters: HeadlineFilters): Promise<any[]> {
    const { data } = await this.api.get('/news/headlines', { params: filters });
    return data;
  }

  public async searchArticles(filters: SearchFilters): Promise<any[]> {
    const { data } = await this.api.get('/news/search', { params: filters });
    return data;
  }
}

export default new NewsApi();