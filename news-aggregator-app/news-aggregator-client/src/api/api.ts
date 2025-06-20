import axios from 'axios';
import { getState } from '../state.js';

const api = axios.create({ baseURL: 'http://localhost:3000/api' });

api.interceptors.request.use(config => {
  const { token } = getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;