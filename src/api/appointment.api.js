import api from "./axios";

export const appointmentApi = {
  book: (data) => api.post("/appointments", data),
};
