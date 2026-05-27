import apiClient from '../../../services/apiClient';

export const getAll  = (params) => apiClient.get('/transactions', { params });
export const create  = (data)   => apiClient.post('/transactions', data);
export const update  = (id, data) => apiClient.put(`/transactions/${id}`, data);
export const remove  = (id)     => apiClient.delete(`/transactions/${id}`);
