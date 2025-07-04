import { BaseApiService } from "./baseApiservice";

class NotificationApi extends BaseApiService {
  public async getSettings(): Promise<any> {
    const { data } = await this.api.get('/notifications/settings');
    return data;
  }

  public async updateSettings(settings: { enabledCategories?: string[]; keywords?: string[]; }): Promise<any> {
    const { data } = await this.api.put('/notifications/settings', settings);
    return data;
  }

  public async getViewableNotifications(): Promise<any[]> {
    const { data } = await this.api.get('/notifications');
    return data;
  }
}

export default new NotificationApi();