import { useQuery } from "@tanstack/react-query";
import { patientApi } from "@/api/patient.api";
import { doctorApi } from "@/api/doctor.api";
import { adminApi } from "@/api/admin.api";

export const appointmentKeys = {
  all: ["appointments"],
  patientList: (filters) => ["appointments", "patient", "list", filters],
  doctorList: (filters) => ["appointments", "doctor", "list", filters],
  adminList: (filters) => ["appointments", "admin", "list", filters],
};

export function usePatientAppointments(filters = {}) {
  return useQuery({
    queryKey: appointmentKeys.patientList(filters),
    queryFn: async () => {
      const { data } = await patientApi.getAppointments(filters);
      return data;
    },
  });
}

export function useDoctorAppointments(filters = {}) {
  return useQuery({
    queryKey: appointmentKeys.doctorList(filters),
    queryFn: async () => {
      const { data } = await doctorApi.getAppointments(filters);
      return data;
    },
  });
}

export function useAdminAppointments(filters = {}) {
  return useQuery({
    queryKey: appointmentKeys.adminList(filters),
    queryFn: async () => {
      const { data } = await adminApi.getAppointments(filters);
      return data;
    },
  });
}
