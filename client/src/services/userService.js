import api from './api';

export const fetchProfile = () => api.get('/users/profile').then((r) => r.data);
export const updateProfile = (payload) => api.put('/users/profile', payload).then((r) => r.data);
export const changePassword = (payload) => api.put('/users/change-password', payload).then((r) => r.data);
