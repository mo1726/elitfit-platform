import api from './axiosConfig';

export const getAllBookings = () => api.get('/bookings');
export const getById = (id) => api.get(`/bookings/${id}`);
export const createBooking = (data) => api.post('/bookings', data);
export const update = (id, data) => api.put(`/bookings/${id}`, data);
export const deleteBooking = (id) => api.delete(`/bookings/${id}`);


export const getBookingsInNextHour = () => {
  return api.get("/bookings/upcoming/hour");
};
