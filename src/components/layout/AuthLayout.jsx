import { Outlet, Link } from "react-router-dom";
import { Heart } from "lucide-react";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 px-4">
      <Link to="/" className="flex items-center gap-2 mb-8">
        <Heart className="h-8 w-8 text-primary" />
        <span className="text-2xl font-bold">MedAppoint</span>
      </Link>
      <div className="w-full max-w-md bg-card rounded-xl shadow-lg border p-6">
        <Outlet />
      </div>
    </div>
  );
}
