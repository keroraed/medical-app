import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/auth.api";
import { getErrorMessage } from "@/lib/utils";
import { toast } from "sonner";
import FormField from "@/components/forms/FormField";
import { Loader2 } from "lucide-react";
import { GENDERS } from "@/lib/constants";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
      "Must contain uppercase, lowercase, digit, and special character",
    ),
  phone: z.string().regex(/^01[0125]\d{8}$/, "Invalid Egyptian phone number"),
  gender: z.enum(["male", "female"], { required_error: "Gender is required" }),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  address: z.string().optional(),
  role: z.enum(["patient", "doctor"]),
});

export default function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "patient" },
  });

  const registerMutation = useMutation({
    mutationFn: (data) => authApi.register(data),
    onSuccess: (response, variables) => {
      toast.success(response.data.message);
      navigate("/verify-email", { state: { email: variables.email } });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const onSubmit = (data) => registerMutation.mutate(data);

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Full Name" error={errors.name} required>
          <input
            type="text"
            {...register("name")}
            placeholder="Ahmed Hassan"
            className="w-full border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </FormField>

        <FormField label="Email" error={errors.email} required>
          <input
            type="email"
            {...register("email")}
            placeholder="you@example.com"
            className="w-full border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </FormField>

        <FormField label="Password" error={errors.password} required>
          <input
            type="password"
            {...register("password")}
            placeholder="••••••••"
            className="w-full border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </FormField>

        <FormField label="Phone" error={errors.phone} required>
          <input
            type="tel"
            {...register("phone")}
            placeholder="01012345678"
            className="w-full border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Gender" error={errors.gender} required>
            <select
              {...register("gender")}
              className="w-full border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select...</option>
              {GENDERS.map((g) => (
                <option key={g} value={g}>
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Date of Birth" error={errors.dateOfBirth} required>
            <input
              type="date"
              {...register("dateOfBirth")}
              className="w-full border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </FormField>
        </div>

        <FormField label="Address" error={errors.address}>
          <input
            type="text"
            {...register("address")}
            placeholder="123 Cairo Street"
            className="w-full border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </FormField>

        <FormField label="Register as" error={errors.role} required>
          <select
            {...register("role")}
            className="w-full border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>
        </FormField>

        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {registerMutation.isPending && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
          Create Account
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
