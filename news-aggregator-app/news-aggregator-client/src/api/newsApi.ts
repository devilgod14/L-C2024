import api from './api.js';

interface HeadlineFilters {
  category?: string;
  startDate?: string;
  endDate?: string;
}

interface SearchFilters extends HeadlineFilters {
    query: string;
    sortBy?: string;
}

export const getHeadlines = async (filters: HeadlineFilters) => {
  const response = await api.get('/news/headlines', { params: filters });
  return response.data;
};

export const searchArticles = async (filters: SearchFilters) => {
    const response = await api.get('/news/search', { params: filters });
    return response.data;
};