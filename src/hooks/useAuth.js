import { useAuthStore } from "@/store/auth.store";
import { getDashboardPath } from "@/lib/utils";

export function useAuth() {
  const { user, token, setAuth, logout } = useAuthStore();

  return {
    user,
    token,
    isAuthenticated: !!token,
    role: user?.role || null,
    dashboardPath: user?.role ? getDashboardPath(user.role) : "/",
    setAuth,
    logout,
  };
}
