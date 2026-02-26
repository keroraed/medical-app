import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function PublicNavbar() {
  const { isAuthenticated, user, dashboardPath } = useAuth();

  return (
    <header className="border-b">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Heart className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold">MedAppoint</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            to="/doctors"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Find Doctors
          </Link>
          {isAuthenticated ? (
            <>
              <span className="text-sm text-muted-foreground">
                Hello, <span className="font-semibold text-foreground">{user?.name?.split(" ")[0]}</span> 👋
              </span>
              <Link
                to={dashboardPath}
                className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
