import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";

// ─── Query Key Factories ─────────────────────────────────────────────────────

export const adminUserKeys = {
  all: ["admin", "users"],
  list: (filters) => ["admin", "users", filters],
  stats: () => ["admin", "users", "stats"],
};

export const adminAppointmentKeys = {
  all: ["admin", "appointments"],
  stats: () => ["admin", "appointments", "stats"],
};

export const adminSpecialtyStatsKeys = {
  stats: () => ["admin", "specialties", "stats"],
};

// ─── Hooks ───────────────────────────────────────────────────────────────────

export function useAdminUsers(filters = {}) {
  const { page = 1, limit = 10, role = "" } = filters;
  const params = { page, limit };
  if (role) params.role = role;

  return useQuery({
    queryKey: adminUserKeys.list({ page, limit, role }),
    queryFn: async () => {
      const { data } = await adminApi.getUsers(params);
      return data;
    },
  });
}

export function useAdminUserStats() {
  return useQuery({
    queryKey: adminUserKeys.stats(),
    queryFn: async () => {
      const { data } = await adminApi.getUsers({ page: 1, limit: 1 });
      return data;
    },
  });
}

export function useAdminAppointmentStats() {
  return useQuery({
    queryKey: adminAppointmentKeys.stats(),
    queryFn: async () => {
      const { data } = await adminApi.getAppointments({ page: 1, limit: 1 });
      return data;
    },
  });
}

export function useAdminSpecialtyStats() {
  return useQuery({
    queryKey: adminSpecialtyStatsKeys.stats(),
    queryFn: async () => {
      const { data } = await adminApi.getSpecialties();
      return data;
    },
  });
}
