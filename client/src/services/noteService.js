import api from './api';

export const fetchNotes = (params) => api.get('/notes', { params }).then((r) => r.data);
export const fetchNote = (id) => api.get(`/notes/${id}`).then((r) => r.data);
export const createNote = (payload) => api.post('/notes', payload).then((r) => r.data);
export const updateNote = (id, payload) => api.put(`/notes/${id}`, payload).then((r) => r.data);
export const deleteNote = (id) => api.delete(`/notes/${id}`).then((r) => r.data);
export const restoreNote = (id) => api.patch(`/notes/restore/${id}`).then((r) => r.data);
export const fetchTrash = () => api.get('/notes/trash/all').then((r) => r.data);
export const permanentlyDeleteNote = (id) => api.delete(`/notes/permanent/${id}`).then((r) => r.data);
export const togglePin = (id) => api.patch(`/notes/pin/${id}`).then((r) => r.data);
export const toggleArchive = (id) => api.patch(`/notes/archive/${id}`).then((r) => r.data);
export const toggleFavorite = (id) => api.patch(`/notes/favorite/${id}`).then((r) => r.data);
export const duplicateNote = (id) => api.post(`/notes/duplicate/${id}`).then((r) => r.data);
export const fetchDashboardStats = () => api.get('/notes/stats/dashboard').then((r) => r.data);
