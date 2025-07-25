import api from './axiosConfig'; // بدل axios

export const getAllUsers = () => api.get('/users/all');
export const getUserById = (id) => api.get(`/users/${id}`);
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const updateUser = (id, userData) => api.put(`/users/${id}`, userData);
export const changePassword = (data) => api.post("/users/change-password", data);

