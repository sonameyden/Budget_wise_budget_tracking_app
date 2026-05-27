import apiClient from '../../../services/apiClient';

export const getSummary          = ()       => apiClient.get('/analytics/summary?period=month');
export const getRecentTransactions = ()     => apiClient.get('/transactions?limit=5');
export const getMonthlyChart     = ()       => apiClient.get('/analytics/monthly?period=month');
export const getCategoryChart    = ()       => apiClient.get('/analytics/categories?period=month');
