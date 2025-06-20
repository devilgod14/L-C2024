import api from './api.js';

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

export const voteOnArticle = async (articleId: string, vote: 'like' | 'dislike') => {
    const response = await api.post(`/articles/${articleId}/vote`, { vote });
    return response.data;
};