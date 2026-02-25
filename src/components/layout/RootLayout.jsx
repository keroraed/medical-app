import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import ErrorBoundary from "@/components/shared/ErrorBoundary";

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <Outlet />
      <Toaster position="top-right" richColors />
    </ErrorBoundary>
  );
}
