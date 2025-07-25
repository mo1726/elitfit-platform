import api from "./axiosConfig";

export const getTrainerPerformance = () => {
  return api.get("/performance/trainer");
};
