import { useState } from "react";
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

export default function VerifyEmail() {
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

  const verifyMutation = useMutation({
    mutationFn: (data) => authApi.verifyEmail({ email, otp: data.otp }),
    onSuccess: () => {
      toast.success("Email verified! You can now log in.");
      navigate("/login");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const resendMutation = useMutation({
    mutationFn: () => authApi.resendOtp({ email }),
    onSuccess: () => {
      toast.success("OTP resent! Check your email.");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const onSubmit = (data) => verifyMutation.mutate(data);

  if (!email) {
    return (
      <div className="text-center">
        <p className="text-muted-foreground mb-4">
          No email provided. Please register first.
        </p>
        <Link to="/register" className="text-primary hover:underline">
          Go to Register
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-2">Verify Email</h2>
      <p className="text-sm text-muted-foreground text-center mb-6">
        Enter the 6-digit code sent to <strong>{email}</strong>
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
          disabled={verifyMutation.isPending}
          className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {verifyMutation.isPending && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
          Verify
        </button>
      </form>

      <div className="text-center mt-4">
        <button
          onClick={() => resendMutation.mutate()}
          disabled={resendMutation.isPending}
          className="text-sm text-primary hover:underline disabled:opacity-50"
        >
          {resendMutation.isPending ? "Sending..." : "Resend OTP"}
        </button>
      </div>
    </div>
  );
}
