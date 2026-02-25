import api from "./axios";

export const patientApi = {
  getProfile: () => api.get("/patients/profile"),
  updateProfile: (data) => api.put("/patients/profile", data),
  getAppointments: (params) => api.get("/patients/appointments", { params }),
  updateAppointment: (id, data) =>
    api.patch(`/patients/appointments/${id}`, data),
};
