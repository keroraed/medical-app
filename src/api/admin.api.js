import api from "./axios";

export const adminApi = {
  getUsers: (params) => api.get("/admin/users", { params }),
  blockUser: (id) => api.patch(`/admin/users/${id}/block`),
  approveDoctor: (id) => api.patch(`/admin/doctors/${id}/approve`),
  getAppointments: (params) => api.get("/admin/appointments", { params }),
  getSpecialties: () => api.get("/admin/specialties"),
  createSpecialty: (data) => api.post("/admin/specialties", data),
  updateSpecialty: (id, data) => api.put(`/admin/specialties/${id}`, data),
  deleteSpecialty: (id) => api.delete(`/admin/specialties/${id}`),
};
