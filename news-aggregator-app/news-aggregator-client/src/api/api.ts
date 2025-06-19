import axios from 'axios';
import { getState, User } from '../state.js'; 

interface HeadlineFilters {
  category?: string;
  startDate?: string;
  endDate?: string;
}

interface Credentials {
  email: string;
  password: string;
}

interface UserData extends Credentials {
  username: string;
}

const api = axios.create({ baseURL: 'http://localhost:3000/api' });

api.interceptors.request.use(config => {
  const { token } = getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const signupUser = async (userData: UserData) => {
  const response = await api.post('/auth/signup', userData);
  return response.data;
};

export const loginUser = async (credentials: Credentials): Promise<{ token: string }> => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const getHeadlines = async (filters: HeadlineFilters) => {
  const response = await api.get('/news/headlines', { params: filters });
  return response.data;
};

export const saveArticle = async (articleId: string) => {
  const response = await api.post('/users/me/saved-articles', { articleId });
  return response.data;
};

export const getSavedArticles = async () => {
  const response = await api.get('/users/me/saved-articles');
  return response.data;
};

export const deleteSavedArticle = async (savedArticleId: string) => {
  const response = await api.delete(`/users/me/saved-articles/${savedArticleId}`);
  return response.data;
};

export const getNotificationSettings = async () => {
  const response = await api.get('/notifications/settings');
  return response.data;
};

export const updateNotificationSettings = async (settings: {
  enabledCategories?: string[];
  keywords?: string[];
}) => {
  const response = await api.put('/notifications/settings', settings);
  return response.data;
};