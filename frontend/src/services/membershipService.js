import api from './axiosConfig';

const membershipService = {
  getAllPlans: () => api.get('/membership-plans'),
  getPlanById: (id) => api.get(`/membership-plans/${id}`),
  createPlan: (data) => api.post('/membership-plans', data),
  updatePlan: (id, data) => api.put(`/membership-plans/${id}`, data),
  deletePlan: (id) => api.delete(`/membership-plans/${id}`),
};

export default membershipService;
