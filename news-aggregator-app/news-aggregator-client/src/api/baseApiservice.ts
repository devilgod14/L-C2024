import axios, { AxiosInstance } from 'axios';
import { getState } from '../state';
import lm from '../utils/localizationManager';
import logger from '../config/logger';

export abstract class BaseApiService {
  protected readonly api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:3000/api',
    });

    this.api.interceptors.request.use(config => {
      const { token } = getState();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.api.interceptors.response.use(
      response => response,
      error => {
        const message = error.response?.data?.message || lm.get('errors.generic');
        logger.error(lm.get('errors.apiError', { message }));
        return Promise.reject(error);
      }
    );
  }
}