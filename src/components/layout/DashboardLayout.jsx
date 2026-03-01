import { Outlet, Link } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import { Menu, X, Heart, LogOut, Home } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Sidebar"
      >
        <div className="flex items-center gap-2 p-4 border-b">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">MedAppoint</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <Sidebar onItemClick={() => setSidebarOpen(false)} />
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="text-sm text-muted-foreground mb-3">{user?.name}</div>
          <button
            onClick={handleLogout}
            className="group relative flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium
              text-red-600 bg-red-50 border border-red-100
              hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-lg hover:shadow-red-500/25
              active:scale-[0.97]
              transition-all duration-300 ease-out cursor-pointer overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <LogOut className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            <span className="relative z-10">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-card border-b px-4 py-3 flex items-center gap-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
            aria-label="Open sidebar"
            aria-expanded={sidebarOpen}
          >
            <Menu className="h-5 w-5" />
          </button>
          <h2 className="font-semibold text-lg">
            {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} Portal
          </h2>
          <Link
            to="/"
            className="ml-auto flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
