import apiClient from '../../../services/apiClient';
export const getSummary    = (period) => apiClient.get(`/analytics/summary?period=${period}`);
export const getMonthly    = (period) => apiClient.get(`/analytics/monthly?period=${period}`);
export const getCategories = (period) => apiClient.get(`/analytics/categories?period=${period}`);
export const getScore      = ()       => apiClient.get('/analytics/score');
