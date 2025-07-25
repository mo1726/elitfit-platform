import api from './axiosConfig';

export const getAllMembers = () => api.get('/member');
export const getMemberByUserId = (userId) => api.get(`/member/${userId}`);
export const createMember = (data) => api.post('/member/subscribe', data);
export const deleteMember = (id) => api.delete('/member/' + id);
export const getPendingMemberships = () => api.get('/member/pending');
export const isMemberActive = (userId) => api.get('/member/isActive/' + userId);
export const getTrainerMembers = (trainerId) => api.get(`/member/trainer/${trainerId}`);
export const activateMember = (userId) => api.put(`/member/activate/${userId}`);
export const upgradeMember = (data) => api.post('/member/upgrade', data);
export const getMemberMe = () => {
  return api.get("/member/me"); // ✅ Correct path as defined in your backend
};



export const updateMemberTrainer = (userId, trainerId) =>
    api.put(`/member/trainer/${userId}`, { trainerId });

export const getTrainers = () => {
  return api.get("/trainers");
};

