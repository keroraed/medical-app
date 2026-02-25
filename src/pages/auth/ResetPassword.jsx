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

const schema = z
  .object({
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
        "Must contain uppercase, lowercase, digit, and special character",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const resetToken = location.state?.resetToken || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (data) =>
      authApi.resetPassword({
        resetToken,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      }),
    onSuccess: () => {
      toast.success("Password reset successfully! Please log in.");
      navigate("/login");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const onSubmit = (data) => mutation.mutate(data);

  if (!resetToken) {
    return (
      <div className="text-center">
        <p className="text-muted-foreground mb-4">
          Invalid reset token. Please start the forgot password flow again.
        </p>
        <Link to="/forgot-password" className="text-primary hover:underline">
          Forgot Password
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-2">Reset Password</h2>
      <p className="text-sm text-muted-foreground text-center mb-6">
        Enter your new password
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="New Password" error={errors.newPassword} required>
          <input
            type="password"
            {...register("newPassword")}
            placeholder="••••••••"
            className="w-full border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </FormField>

        <FormField
          label="Confirm Password"
          error={errors.confirmPassword}
          required
        >
          <input
            type="password"
            {...register("confirmPassword")}
            placeholder="••••••••"
            className="w-full border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </FormField>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Reset Password
        </button>
      </form>
    </div>
  );
}
