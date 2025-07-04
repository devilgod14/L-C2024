import { BaseApiService } from './baseApiservice';
import { UserData, Credentials } from '../types/api.types'; 
import { User } from '../types/auth.types';
class AuthApi extends BaseApiService {
  public async signupUser(userData: UserData): Promise<User> {
    const { data } = await this.api.post<User>('/auth/signup', userData);
    return data;
  }

  public async loginUser(credentials: Credentials): Promise<{ token: string }> {
    const { data } = await this.api.post<{ token: string }>('/auth/login', credentials);
    return data;
  }
}

export default new AuthApi();