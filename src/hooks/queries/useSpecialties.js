import { useQuery } from "@tanstack/react-query";
import { specialtyApi } from "@/api/specialty.api";
import { adminApi } from "@/api/admin.api";

export const specialtyKeys = {
  all: ["specialties"],
  list: () => ["specialties", "list"],
  adminList: () => ["specialties", "admin", "list"],
};

export function useSpecialties() {
  return useQuery({
    queryKey: specialtyKeys.list(),
    queryFn: async () => {
      const { data } = await specialtyApi.getAll();
      return data.data;
    },
  });
}

export function useAdminSpecialties() {
  return useQuery({
    queryKey: specialtyKeys.adminList(),
    queryFn: async () => {
      const { data } = await adminApi.getSpecialties();
      return data.data;
    },
  });
}
