import api from './axiosConfig';
export const getTrainerClasses = () => api.get('/classes/trainer');
export const createClass = (data) => api.post('/classes', data);
export const createClassAdmin = (data) => api.post('/classes/admin', data);
export const updateClass = (id, data) => api.put(`/classes/${id}`, data);
export const deleteClass = (id) => api.delete(`/classes/${id}`);
export const getAllClasses = () => api.get('/classes');
export const getClassById = (id) => api.get('/classes/' + id);



export const getClassesByTrainerUserId = (trainerUserId) => {
  return api.get(`/classes/trainer/${trainerUserId}`);
};






export const getUpcomingClasses = () => api.get('/classes/upcoming');
