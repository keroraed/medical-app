import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/api/auth.api";
import { getErrorMessage } from "@/lib/utils";
import { toast } from "sonner";

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data) => authApi.register(data),
    onSuccess: (response, variables) => {
      toast.success(response.data.message);
      const redirectTo = response.data.redirectTo;
      if (redirectTo) {
        navigate(redirectTo);
      } else {
        navigate("/verify-email", { state: { email: variables.email } });
      }
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
