// src/services/dietService.js
import api from "./axiosConfig";

// Member-side
export const getMyDietPlans = () => api.get("/diet/plan/me");

// Trainer-side
export const getTrainerDietPlans = () => api.get("/diet/plan/trainer");

// Get member info
export const getMemberMe = () => api.get("/member/me");

// Get trainer's members
export const getTrainerMembers = () => api.get("/member/my-members");

// Create diet plan
export const createDietPlan = (dietPlan) => api.post("/diet/plan", dietPlan);

// Create meal entry for a plan
export const createEntry = (entry) => {
  return api.post("/diet/entry", {
    dietPlanId: entry.planId,
    day: entry.day,
    time: entry.time,
    meal: entry.meal,
  });
};

// Update a meal entry
export const updateDietEntry = (entryId, newMeal) =>
  api.put(`/diet/entry/${entryId}`, newMeal); // newMeal = { meal: "..." }

// Get full plan info by ID
export const getPlanById = (id) => api.get(`/diet/plan/${id}`);

// Get entries by plan ID
export const getEntriesByPlanId = (planId) => {
  console.log("Fetching entries for planId:", planId);
  return api.get(`/diet/entries/${planId}`);
};



export const getPlanByMemberId = (memberId) => {
  return api.get(`/diet/plan/member/${memberId}`); // returns single object
};

export const getMyDietPlan = () => api.get("/diet/plan/me");
