import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import ErrorBoundary from "@/components/shared/ErrorBoundary";

export default function RootLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthLogout = () => navigate("/login", { replace: true });
    window.addEventListener("auth:logout", handleAuthLogout);
    return () => window.removeEventListener("auth:logout", handleAuthLogout);
  }, [navigate]);

  return (
    <ErrorBoundary>
      <Outlet />
      <Toaster position="top-right" richColors />
    </ErrorBoundary>
  );
}
