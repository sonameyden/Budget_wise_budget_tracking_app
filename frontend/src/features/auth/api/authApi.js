import apiClient from '../../../services/apiClient';

export const login    = (email, password) => apiClient.post('/auth/login',    { email, password });
export const register = (name, email, password) => apiClient.post('/auth/register', { name, email, password });
export const getMe    = () => apiClient.get('/auth/me');
