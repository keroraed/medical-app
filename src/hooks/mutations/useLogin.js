import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/api/auth.api";
import { useAuth } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/utils";
import { toast } from "sonner";

export function useLogin() {
  const { setAuth, dashboardPath } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data) => authApi.login(data),
    onSuccess: (response) => {
      const { user, token } = response.data;
      setAuth({ user, token });
      toast.success("Login successful!");
      navigate(dashboardPath || `/${user.role}`);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
