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

export const getReportedArticles = async () => {
  const response = await api.get('/admin/reports');
  return response.data;
};

export const hideArticle = async (articleId: string) => {
  const response = await api.put(`/admin/articles/${articleId}/hide`);
  return response.data;
};

export const hideCategory = async (categoryId: string) => {
  const response = await api.put(`/admin/categories/${categoryId}/hide`);
  return response.data;
};

export const unhideCategory = async (categoryId: string) => {
  const response = await api.put(`/admin/categories/${categoryId}/unhide`);
  return response.data;
};

export const getBlockedKeywords = async () => {
  const response = await api.get('/admin/keywords');
  return response.data;
};

export const addBlockedKeyword = async (keyword: string) => {
  const response = await api.post('/admin/keywords', { keyword });
  return response.data;
};

export const removeBlockedKeyword = async (keywordId: string) => {
  const response = await api.delete(`/admin/keywords/${keywordId}`);
  return response.data;
};
