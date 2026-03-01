import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import { ROLES } from "@/lib/constants";

// Layouts
import RootLayout from "@/components/layout/RootLayout";
import AuthLayout from "@/components/layout/AuthLayout";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Public pages (lazy)
const Home = lazy(() => import("@/pages/public/Home"));
const DoctorsList = lazy(() => import("@/pages/public/DoctorsList"));
const DoctorDetail = lazy(() => import("@/pages/public/DoctorDetail"));
const NotFound = lazy(() => import("@/pages/public/NotFound"));

// Auth pages (lazy)
const AuthPage = lazy(() => import("@/pages/auth/AuthPage"));
const Login = lazy(() => import("@/pages/auth/Login"));
const Register = lazy(() => import("@/pages/auth/Register"));
const VerifyEmail = lazy(() => import("@/pages/auth/VerifyEmail"));
const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPassword"));
const VerifyOtp = lazy(() => import("@/pages/auth/VerifyOtp"));
const ResetPassword = lazy(() => import("@/pages/auth/ResetPassword"));

// Patient pages (lazy)
const PatientDashboard = lazy(() => import("@/pages/patient/PatientDashboard"));
const PatientProfile = lazy(() => import("@/pages/patient/PatientProfile"));
const PatientAppointments = lazy(
  () => import("@/pages/patient/PatientAppointments"),
);
const BookAppointment = lazy(() => import("@/pages/patient/BookAppointment"));

// Doctor pages (lazy)
const DoctorDashboard = lazy(() => import("@/pages/doctor/DoctorDashboard"));
const DoctorProfile = lazy(() => import("@/pages/doctor/DoctorProfile"));
const DoctorAppointments = lazy(
  () => import("@/pages/doctor/DoctorAppointments"),
);

// Chat page (lazy)
const ChatPage = lazy(() => import("@/pages/chat/ChatPage"));

// Admin pages (lazy)
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const UsersManagement = lazy(() => import("@/pages/admin/UsersManagement"));
const DoctorsApproval = lazy(() => import("@/pages/admin/DoctorsApproval"));
const AppointmentsOverview = lazy(
  () => import("@/pages/admin/AppointmentsOverview"),
);
const SpecialtiesManagement = lazy(
  () => import("@/pages/admin/SpecialtiesManagement"),
);

function SuspenseWrapper({ children }) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // Public routes
      {
        path: "/",
        element: (
          <SuspenseWrapper>
            <Home />
          </SuspenseWrapper>
        ),
      },
      {
        path: "/doctors",
        element: (
          <SuspenseWrapper>
            <DoctorsList />
          </SuspenseWrapper>
        ),
      },
      {
        path: "/doctors/:id",
        element: (
          <SuspenseWrapper>
            <DoctorDetail />
          </SuspenseWrapper>
        ),
      },

      // Dual auth page (animated login/register)
      {
        path: "/login",
        element: (
          <SuspenseWrapper>
            <AuthPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "/register",
        element: (
          <SuspenseWrapper>
            <AuthPage />
          </SuspenseWrapper>
        ),
      },

      // Other auth routes
      {
        element: <AuthLayout />,
        children: [
          {
            path: "/verify-email",
            element: (
              <SuspenseWrapper>
                <VerifyEmail />
              </SuspenseWrapper>
            ),
          },
          {
            path: "/forgot-password",
            element: (
              <SuspenseWrapper>
                <ForgotPassword />
              </SuspenseWrapper>
            ),
          },
          {
            path: "/verify-otp",
            element: (
              <SuspenseWrapper>
                <VerifyOtp />
              </SuspenseWrapper>
            ),
          },
          {
            path: "/reset-password",
            element: (
              <SuspenseWrapper>
                <ResetPassword />
              </SuspenseWrapper>
            ),
          },
        ],
      },

      // Patient routes
      {
        path: "/patient",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.PATIENT]}>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: (
              <SuspenseWrapper>
                <PatientDashboard />
              </SuspenseWrapper>
            ),
          },
          {
            path: "profile",
            element: (
              <SuspenseWrapper>
                <PatientProfile />
              </SuspenseWrapper>
            ),
          },
          {
            path: "appointments",
            element: (
              <SuspenseWrapper>
                <PatientAppointments />
              </SuspenseWrapper>
            ),
          },
          {
            path: "book",
            element: (
              <SuspenseWrapper>
                <BookAppointment />
              </SuspenseWrapper>
            ),
          },
          {
            path: "chat",
            element: (
              <SuspenseWrapper>
                <ChatPage />
              </SuspenseWrapper>
            ),
          },
        ],
      },

      // Doctor routes
      {
        path: "/doctor",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.DOCTOR]}>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: (
              <SuspenseWrapper>
                <DoctorDashboard />
              </SuspenseWrapper>
            ),
          },
          {
            path: "profile",
            element: (
              <SuspenseWrapper>
                <DoctorProfile />
              </SuspenseWrapper>
            ),
          },
          {
            path: "appointments",
            element: (
              <SuspenseWrapper>
                <DoctorAppointments />
              </SuspenseWrapper>
            ),
          },
          {
            path: "chat",
            element: (
              <SuspenseWrapper>
                <ChatPage />
              </SuspenseWrapper>
            ),
          },
        ],
      },

      // Admin routes
      {
        path: "/admin",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: (
              <SuspenseWrapper>
                <AdminDashboard />
              </SuspenseWrapper>
            ),
          },
          {
            path: "users",
            element: (
              <SuspenseWrapper>
                <UsersManagement />
              </SuspenseWrapper>
            ),
          },
          {
            path: "doctors",
            element: (
              <SuspenseWrapper>
                <DoctorsApproval />
              </SuspenseWrapper>
            ),
          },
          {
            path: "appointments",
            element: (
              <SuspenseWrapper>
                <AppointmentsOverview />
              </SuspenseWrapper>
            ),
          },
          {
            path: "specialties",
            element: (
              <SuspenseWrapper>
                <SpecialtiesManagement />
              </SuspenseWrapper>
            ),
          },
        ],
      },

      // 404 catch-all
      {
        path: "*",
        element: (
          <SuspenseWrapper>
            <NotFound />
          </SuspenseWrapper>
        ),
      },
    ],
  },
]);

export default router;
