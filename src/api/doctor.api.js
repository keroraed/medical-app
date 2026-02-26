import api from "./axios";

export const doctorApi = {
  // Protected (doctor role)
  getProfile: () => api.get("/doctors/profile"),
  updateProfile: (data) => api.put("/doctors/profile", data),
  uploadProfilePicture: (file) => {
    const formData = new FormData();
    formData.append("profilePicture", file);
    return api.patch("/doctors/profile/picture", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  getAppointments: (params) => api.get("/doctors/appointments", { params }),
  updateAppointment: (id, data) =>
    api.patch(`/doctors/appointments/${id}`, data),

  // Public
  listDoctors: (params) => api.get("/doctors", { params }),
  getDoctorById: (id) => api.get(`/doctors/${id}`),
  getDoctorAvailability: (id) => api.get(`/doctors/${id}/availability`),
};
