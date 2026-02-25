import { useQuery } from "@tanstack/react-query";
import { doctorApi } from "@/api/doctor.api";

export const doctorKeys = {
  all: ["doctors"],
  list: (filters) => ["doctors", "list", filters],
  detail: (id) => ["doctors", "detail", id],
  availability: (id) => ["doctors", "availability", id],
  profile: () => ["doctors", "profile"],
};

export function useDoctors(filters = {}) {
  return useQuery({
    queryKey: doctorKeys.list(filters),
    queryFn: async () => {
      const { data } = await doctorApi.listDoctors(filters);
      return data;
    },
  });
}

export function useDoctorDetail(id) {
  return useQuery({
    queryKey: doctorKeys.detail(id),
    queryFn: async () => {
      const { data } = await doctorApi.getDoctorById(id);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useDoctorAvailability(id) {
  return useQuery({
    queryKey: doctorKeys.availability(id),
    queryFn: async () => {
      const { data } = await doctorApi.getDoctorAvailability(id);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useDoctorProfile() {
  return useQuery({
    queryKey: doctorKeys.profile(),
    queryFn: async () => {
      const { data } = await doctorApi.getProfile();
      return data.data;
    },
  });
}
