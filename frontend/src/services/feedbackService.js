// src/services/feedbackService.js
import api from './axiosConfig';

/**
 * Submit feedback for a booking
 * @param {Object} feedbackData - { bookingId, feedbackScore, feedbackText }
 */
export const submitFeedback = (feedbackData) => {
  return api.post('/bookings/feedback', feedbackData);
};
