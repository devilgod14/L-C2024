import api from './api.js';

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

export const getViewableNotifications = async () => {
    const response = await api.get('/notifications');
    return response.data;
};