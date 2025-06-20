import api from './api.js';

export const getSources = async () => {
  const response = await api.get('/admin/sources');
  return response.data;
};

export const addCategory = async (categoryName: string) => {
  const response = await api.post('/admin/categories', { name: categoryName });
  return response.data;
};

export const updateSourceApiKey = async (sourceId: string, apiKey: string) => {
  const response = await api.put(`/admin/sources/${sourceId}`, { apiKey });
  return response.data;
};

export const getSourceDetails = async (sourceId: string) => {
  const response = await api.get(`/admin/sources/${sourceId}`);
  return response.data;
};

