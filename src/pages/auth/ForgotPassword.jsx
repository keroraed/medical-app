import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/auth.api";
import { getErrorMessage } from "@/lib/utils";
import { toast } from "sonner";
import FormField from "@/components/forms/FormField";
import { Loader2 } from "lucide-react";

const schema = z.object({
  email: z.string().email("Invalid email address"),
});

export default function ForgotPassword() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (data) => authApi.forgotPassword(data),
    onSuccess: (response, variables) => {
      toast.success("If the email is registered, you will receive an OTP.");
      navigate("/verify-otp", { state: { email: variables.email } });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const onSubmit = (data) => mutation.mutate(data);

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-2">Forgot Password</h2>
      <p className="text-sm text-muted-foreground text-center mb-6">
        Enter your email to receive a reset OTP
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Email" error={errors.email} required>
          <input
            type="email"
            {...register("email")}
            placeholder="you@example.com"
            className="w-full border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </FormField>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Send OTP
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-4">
        <Link to="/login" className="text-primary hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  );
}
