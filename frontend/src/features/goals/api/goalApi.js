import apiClient from '../../../services/apiClient';
export const getAll = ()        => apiClient.get('/goals');
export const create = (data)    => apiClient.post('/goals', data);
export const update = (id, d)   => apiClient.put(`/goals/${id}`, d);
export const remove = (id)      => apiClient.delete(`/goals/${id}`);
