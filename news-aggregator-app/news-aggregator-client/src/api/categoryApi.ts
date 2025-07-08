import { BaseApiService } from "./baseApiservice";

class CategoryApi extends BaseApiService {
  public async getAll(): Promise<any[]> {
    const { data } = await this.api.get('/categories');
    return data;
  }
}

export default new CategoryApi();