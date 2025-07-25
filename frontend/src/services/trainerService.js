import api from './axiosConfig';
export const getAllTrainers = () => api.get('/trainers');
export const getById = (id) => api.get('/trainers/' + id);
export const createTrainer = (data) => api.post('/trainers', data);
export const update = (id, data) => api.put('/trainers/' + id, data);
export const deleteTrainer = (id) => api.delete('/trainers/' + id);
export const getTrainerByUserId = (userId) => api.get(`/trainers/user/${userId}`);
export const getMembersByTrainer = () => api.get('/trainers/members');
export const getTrainerById = (id) => api.get(`/trainers/${id}`);





