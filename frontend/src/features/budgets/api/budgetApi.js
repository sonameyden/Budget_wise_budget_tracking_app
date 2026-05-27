import apiClient from '../../../services/apiClient';
export const getAll  = (params) => apiClient.get('/budgets', { params });
export const create  = (data)   => apiClient.post('/budgets', data);
export const update  = (id, d)  => apiClient.put(`/budgets/${id}`, d);
export const remove  = (id)     => apiClient.delete(`/budgets/${id}`);
