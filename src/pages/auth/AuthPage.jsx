import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/auth.api";
import { useAuth } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/utils";
import { toast } from "sonner";
import FormField from "@/components/forms/FormField";
import { GENDERS } from "@/lib/constants";
import {
  Loader2,
  Heart,
  Stethoscope,
  UserPlus,
  LogIn,
  ArrowRight,
  Shield,
  Calendar,
} from "lucide-react";

/* ─── Schemas ─── */
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
      "Must contain uppercase, lowercase, digit & special character",
    ),
  phone: z.string().regex(/^01[0125]\d{8}$/, "Invalid Egyptian phone number"),
  gender: z.enum(["male", "female"], { required_error: "Gender is required" }),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  address: z.string().optional(),
  role: z.enum(["patient", "doctor"]),
});

/* ─── Login Panel ─── */
function LoginForm() {
  const navigate = useNavigate();
  const { setAuth, dashboardPath } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const loginMutation = useMutation({
    mutationFn: (data) => authApi.login(data),
    onSuccess: (response) => {
      const { user, token } = response.data;
      setAuth({ user, token });
      toast.success("Login successful!");
      navigate(dashboardPath || `/${user.role}`);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <form
      onSubmit={handleSubmit((d) => loginMutation.mutate(d))}
      className="space-y-5"
    >
      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold">Welcome Back</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Sign in to your account
        </p>
      </div>

      <FormField label="Email" error={errors.email} required>
        <input
          type="email"
          {...register("email")}
          placeholder="you@example.com"
          className="w-full border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
        />
      </FormField>

      <FormField label="Password" error={errors.password} required>
        <input
          type="password"
          {...register("password")}
          placeholder="••••••••"
          className="w-full border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
        />
      </FormField>

      <div className="text-right">
        <Link
          to="/forgot-password"
          className="text-sm text-primary hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
      >
        {loginMutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <LogIn className="h-4 w-4" />
        )}
        Sign In
      </button>
    </form>
  );
}

/* ─── Register Panel ─── */
function RegisterForm() {
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
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <form
      onSubmit={handleSubmit((d) => registerMutation.mutate(d))}
      className="space-y-4"
    >
      <div className="text-center mb-1">
        <h2 className="text-2xl font-bold">Create Account</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Join our healthcare platform
        </p>
      </div>

      <FormField label="Full Name" error={errors.name} required>
        <input
          type="text"
          {...register("name")}
          placeholder="Ahmed Hassan"
          className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
        />
      </FormField>

      <FormField label="Email" error={errors.email} required>
        <input
          type="email"
          {...register("email")}
          placeholder="you@example.com"
          className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
        />
      </FormField>

      <FormField label="Password" error={errors.password} required>
        <input
          type="password"
          {...register("password")}
          placeholder="••••••••"
          className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
        />
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Phone" error={errors.phone} required>
          <input
            type="tel"
            {...register("phone")}
            placeholder="01012345678"
            className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
          />
        </FormField>

        <FormField label="Gender" error={errors.gender} required>
          <select
            {...register("gender")}
            className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
          >
            <option value="">Select...</option>
            {GENDERS.map((g) => (
              <option key={g} value={g}>
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Date of Birth" error={errors.dateOfBirth} required>
          <input
            type="date"
            {...register("dateOfBirth")}
            className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
          />
        </FormField>

        <FormField label="Register as" error={errors.role} required>
          <select
            {...register("role")}
            className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>
        </FormField>
      </div>

      <FormField label="Address" error={errors.address}>
        <input
          type="text"
          {...register("address")}
          placeholder="123 Cairo Street"
          className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
        />
      </FormField>

      <button
        type="submit"
        disabled={registerMutation.isPending}
        className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
      >
        {registerMutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <UserPlus className="h-4 w-4" />
        )}
        Create Account
      </button>
    </form>
  );
}

/* ─── Main Dual Auth Page ─── */
export default function AuthPage() {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.pathname !== "/register");

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      {/* Top logo bar */}
      <div className="py-4 px-6">
        <Link to="/" className="inline-flex items-center gap-2">
          <Heart className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold">MedAppoint</span>
        </Link>
      </div>

      {/* Centered container */}
      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="relative w-full max-w-[1020px] min-h-[640px] bg-card rounded-2xl shadow-2xl overflow-hidden border">
          {/* ── Form panels (sit beneath the overlay) ── */}
          <div className="absolute inset-0 flex">
            {/* Left panel: Login form */}
            <div
              className={`w-1/2 flex items-center justify-center p-8 transition-all duration-700 ease-in-out ${
                isLogin
                  ? "opacity-100 translate-x-0 pointer-events-auto"
                  : "opacity-0 -translate-x-8 pointer-events-none"
              }`}
            >
              <div className="w-full max-w-sm">
                <LoginForm />
              </div>
            </div>

            {/* Right panel: Register form */}
            <div
              className={`w-1/2 flex items-center justify-center p-8 transition-all duration-700 ease-in-out ${
                !isLogin
                  ? "opacity-100 translate-x-0 pointer-events-auto"
                  : "opacity-0 translate-x-8 pointer-events-none"
              }`}
            >
              <div className="w-full max-w-sm">
                <RegisterForm />
              </div>
            </div>
          </div>

          {/* ── Animated overlay ── */}
          <div
            className={`absolute inset-y-0 w-1/2 transition-transform duration-700 ease-in-out z-10 ${
              isLogin ? "translate-x-full" : "translate-x-0"
            }`}
          >
            <div className="h-full bg-gradient-to-br from-primary via-primary/90 to-blue-700 text-primary-foreground flex flex-col items-center justify-center p-10 text-center relative overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/10 rounded-full" />
              <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-white/5 rounded-full" />
              <div className="absolute top-1/3 -left-8 w-24 h-24 bg-white/10 rounded-full" />

              {isLogin ? (
                /* Overlay when Login is visible → CTA to Register */
                <div className="relative z-10 space-y-6 animate-fade-in">
                  <div className="inline-flex p-4 bg-white/15 rounded-2xl backdrop-blur-sm">
                    <UserPlus className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-bold">New Here?</h3>
                  <p className="text-sm text-white/80 max-w-[240px] mx-auto leading-relaxed">
                    Create an account to book appointments, manage your health
                    records, and connect with top doctors.
                  </p>
                  <div className="flex flex-col gap-3 items-center">
                    <button
                      onClick={() => setIsLogin(false)}
                      className="px-8 py-2.5 border-2 border-white rounded-lg font-medium hover:bg-white hover:text-primary transition-all duration-300 flex items-center gap-2 group"
                    >
                      Create Account
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                  <div className="flex gap-6 pt-4 text-white/60">
                    <div className="flex items-center gap-1.5 text-xs">
                      <Shield className="h-3.5 w-3.5" />
                      Secure
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <Calendar className="h-3.5 w-3.5" />
                      Easy Booking
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <Stethoscope className="h-3.5 w-3.5" />
                      Top Doctors
                    </div>
                  </div>
                </div>
              ) : (
                /* Overlay when Register is visible → CTA to Login */
                <div className="relative z-10 space-y-6 animate-fade-in">
                  <div className="inline-flex p-4 bg-white/15 rounded-2xl backdrop-blur-sm">
                    <LogIn className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-bold">Welcome Back!</h3>
                  <p className="text-sm text-white/80 max-w-[240px] mx-auto leading-relaxed">
                    Already have an account? Sign in to access your dashboard,
                    appointments, and health records.
                  </p>
                  <div className="flex flex-col gap-3 items-center">
                    <button
                      onClick={() => setIsLogin(true)}
                      className="px-8 py-2.5 border-2 border-white rounded-lg font-medium hover:bg-white hover:text-primary transition-all duration-300 flex items-center gap-2 group"
                    >
                      Sign In
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                  <div className="flex gap-6 pt-4 text-white/60">
                    <div className="flex items-center gap-1.5 text-xs">
                      <Shield className="h-3.5 w-3.5" />
                      Secure
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <Calendar className="h-3.5 w-3.5" />
                      Easy Booking
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <Stethoscope className="h-3.5 w-3.5" />
                      Top Doctors
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Mobile view: stacked (shown below md) ── */}
          <div className="md:hidden relative z-20 bg-card p-6">
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
                  isLogin
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
                  !isLogin
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                Register
              </button>
            </div>
            <div
              className={`transition-all duration-500 ease-in-out ${
                isLogin ? "block" : "hidden"
              }`}
            >
              <LoginForm />
            </div>
            <div
              className={`transition-all duration-500 ease-in-out ${
                !isLogin ? "block" : "hidden"
              }`}
            >
              <RegisterForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
