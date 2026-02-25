import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/auth.api";
import { getErrorMessage } from "@/lib/utils";
import { toast } from "sonner";
import FormField from "@/components/forms/FormField";
import { Loader2 } from "lucide-react";

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(otpSchema),
  });

  const mutation = useMutation({
    mutationFn: (data) => authApi.verifyOtp({ email, otp: data.otp }),
    onSuccess: (response) => {
      toast.success("OTP verified!");
      navigate("/reset-password", {
        state: { resetToken: response.data.resetToken },
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const onSubmit = (data) => mutation.mutate(data);

  if (!email) {
    return (
      <div className="text-center">
        <p className="text-muted-foreground mb-4">
          No email provided. Please start the forgot password flow.
        </p>
        <Link to="/forgot-password" className="text-primary hover:underline">
          Forgot Password
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-2">Verify OTP</h2>
      <p className="text-sm text-muted-foreground text-center mb-6">
        Enter the reset code sent to <strong>{email}</strong>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="OTP Code" error={errors.otp} required>
          <input
            type="text"
            {...register("otp")}
            placeholder="123456"
            maxLength={6}
            className="w-full border rounded-md px-3 py-2 text-sm text-center tracking-widest text-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </FormField>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Verify Code
        </button>
      </form>
    </div>
  );
}
