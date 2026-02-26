import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

export default function PublicNavbar({ dark = false }) {
  const { isAuthenticated, user, dashboardPath } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  // When dark=true and not scrolled, use white text; otherwise normal gray
  const isDark = dark && !scrolled;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-1.5 rounded-lg bg-blue-600 shadow-md shadow-blue-600/25 group-hover:shadow-lg group-hover:shadow-blue-600/30 transition-shadow duration-300">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <span className={`text-xl font-bold transition-colors duration-300 ${isDark ? "text-white" : "text-gray-900"}`}>MedAppoint</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/doctors"
              className={`text-sm font-medium transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:transition-all after:duration-300 hover:after:w-full ${
                isDark
                  ? "text-white/80 hover:text-white after:bg-white"
                  : "text-gray-600 hover:text-blue-600 after:bg-blue-600"
              }`}
            >
              Find Doctors
            </Link>
            {isHome && (
              <a
                href="#how-it-works"
                className={`text-sm font-medium transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:transition-all after:duration-300 hover:after:w-full ${
                  isDark
                    ? "text-white/80 hover:text-white after:bg-white"
                    : "text-gray-600 hover:text-blue-600 after:bg-blue-600"
                }`}
              >
                How It Works
              </a>
            )}
            {!isHome && (
              <Link
                to="/"
                className={`text-sm font-medium transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:transition-all after:duration-300 hover:after:w-full ${
                  isDark
                    ? "text-white/80 hover:text-white after:bg-white"
                    : "text-gray-600 hover:text-blue-600 after:bg-blue-600"
                }`}
              >
                Home
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-4 ml-2">
                <span className={`text-sm transition-colors duration-300 ${isDark ? "text-white/70" : "text-gray-500"}`}>
                  Hello,{" "}
                  <span className={`font-semibold ${isDark ? "text-white" : "text-gray-700"}`}>
                    {user?.name?.split(" ")[0]}
                  </span>{" "}
                  👋
                </span>
                <Link
                  to={dashboardPath}
                  className={`text-sm font-semibold px-5 py-2.5 rounded-xl hover:-translate-y-0.5 transition-all duration-300 ${
                    isDark
                      ? "bg-white text-blue-700 shadow-md shadow-black/10 hover:shadow-lg"
                      : "bg-blue-600 text-white shadow-md shadow-blue-600/25 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30"
                  }`}
                >
                  Dashboard
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-2">
                <Link
                  to="/login"
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isDark ? "text-white/80 hover:text-white" : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className={`text-sm font-semibold px-5 py-2.5 rounded-xl hover:-translate-y-0.5 transition-all duration-300 ${
                    isDark
                      ? "bg-white text-blue-700 shadow-md shadow-black/10 hover:shadow-lg"
                      : "bg-blue-600 text-white shadow-md shadow-blue-600/25 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30"
                  }`}
                >
                  Register
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className={`md:hidden p-2 rounded-lg transition-colors ${isDark ? "text-white hover:bg-white/10" : "text-gray-600 hover:bg-gray-100"}`}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-gray-100 shadow-lg overflow-hidden"
          >
            <nav className="px-4 py-4 flex flex-col gap-3">
              <Link
                to="/doctors"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50"
              >
                Find Doctors
              </Link>
              {isHome ? (
                <a
                  href="#how-it-works"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50"
                >
                  How It Works
                </a>
              ) : (
                <Link
                  to="/"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50"
                >
                  Home
                </Link>
              )}
              <div className="border-t border-gray-100 pt-3 mt-1 flex flex-col gap-2">
                {isAuthenticated ? (
                  <Link
                    to={dashboardPath}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-semibold bg-blue-600 text-white text-center px-5 py-2.5 rounded-xl"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="text-sm font-medium text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 text-center"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileOpen(false)}
                      className="text-sm font-semibold bg-blue-600 text-white text-center px-5 py-2.5 rounded-xl"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
