import api from "./axios";

export const appointmentApi = {
  book: (data) => api.post("/appointments", data),
  getAvailableSlots: (doctorId, date) =>
    api.get("/appointments/slots", { params: { doctorId, date } }),
};
