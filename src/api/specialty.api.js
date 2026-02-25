import api from "./axios";

export const specialtyApi = {
  getAll: () => api.get("/specialties"),
};
