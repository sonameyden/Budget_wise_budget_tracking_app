import apiClient from '../../../services/apiClient';

export const getAll      = ()        => apiClient.get('/accounts');
export const getNetWorth = ()        => apiClient.get('/accounts/net-worth');
export const create      = (data)    => apiClient.post('/accounts', data);
export const update      = (id, d)   => apiClient.put(`/accounts/${id}`, d);
export const remove      = (id)      => apiClient.delete(`/accounts/${id}`);
export const transfer    = (data)    => apiClient.post('/accounts/transfer', data);

export const getAllIncome  = (params) => apiClient.get('/income', { params });
export const createIncome  = (data)  => apiClient.post('/income', data);
export const updateIncome  = (id, d) => apiClient.put(`/income/${id}`, d);
export const removeIncome  = (id)    => apiClient.delete(`/income/${id}`);
