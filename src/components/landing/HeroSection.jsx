import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Play,
  Stethoscope,
  Users,
  Star,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const stats = [
  { icon: Stethoscope, value: "500+", label: "Expert Doctors" },
  { icon: Users, value: "10k+", label: "Happy Patients" },
  { icon: Star, value: "98%", label: "Satisfaction Rate" },
  { icon: ShieldCheck, value: "24/7", label: "Support Available" },
];

export default function HeroSection() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50" />

      {/* Floating blobs */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 rounded-full bg-blue-200/30 blur-3xl"
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-cyan-200/30 blur-3xl"
        animate={{
          x: [0, -25, 0],
          y: [0, 25, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-indigo-200/20 blur-3xl"
        animate={{
          x: [0, 20, 0],
          y: [0, 15, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #2563eb 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                Trusted by 10,000+ patients
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1] mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Your Health,{" "}
              <span className="relative">
                <span className="relative z-10 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Our Priority
                </span>
                <motion.span
                  className="absolute bottom-2 left-0 w-full h-3 bg-blue-200/50 rounded-full -z-0"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  style={{ originX: 0 }}
                />
              </span>
            </motion.h1>

            <motion.p
              className="text-lg text-gray-600 leading-relaxed max-w-lg mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Book appointments with top-rated doctors in seconds. Manage your
              entire healthcare journey with our modern, easy-to-use platform
              designed with your wellbeing in mind.
            </motion.p>

            <motion.div
              className="flex flex-wrap items-center gap-4 mb-10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link
                to="/doctors"
                className="group relative inline-flex items-center gap-2 bg-blue-600 text-white px-7 py-3.5 rounded-xl font-semibold text-base shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:bg-blue-700 transition-all duration-300 hover:-translate-y-0.5"
              >
                Find a Doctor
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <a
                href="#how-it-works"
                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-base text-gray-700 bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-300 hover:-translate-y-0.5"
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-200 transition-colors">
                  <Play className="h-3 w-3 ml-0.5" />
                </span>
                How It Works
              </a>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              className="flex items-center gap-4 text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="flex -space-x-2">
                {[
                  "bg-blue-500",
                  "bg-green-500",
                  "bg-purple-500",
                  "bg-orange-500",
                ].map((color, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full ${color} border-2 border-white flex items-center justify-center text-xs font-bold text-white`}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <span>
                Join <strong className="text-gray-700">2,000+</strong> patients
                who booked this week
              </span>
            </motion.div>
          </div>

          {/* Right side — medical illustration */}
          <motion.div
            className="relative hidden lg:block"
            initial={{ opacity: 0, scale: 0.9, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative">
              {/* Main card */}
              <div className="relative bg-white rounded-3xl shadow-2xl shadow-blue-900/10 p-8 border border-gray-100">
                <div className="aspect-square w-full max-w-md mx-auto relative">
                  {/* Medical illustration using shapes */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8">
                    {/* Stylised stethoscope icon */}
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                      <Stethoscope className="h-14 w-14 text-white" />
                    </div>
                    <p className="text-xl font-bold text-gray-800 mt-2">
                      Expert Care Awaits
                    </p>
                    <p className="text-sm text-gray-500 text-center max-w-xs">
                      Choose from hundreds of verified medical professionals
                      across 30+ specialties
                    </p>
                    {/* Mini stats */}
                    <div className="grid grid-cols-3 gap-3 w-full mt-4">
                      {[
                        { v: "500+", l: "Doctors" },
                        { v: "30+", l: "Specialties" },
                        { v: "4.9", l: "Rating" },
                      ].map((stat) => (
                        <div
                          key={stat.l}
                          className="text-center p-3 bg-white rounded-xl shadow-sm border border-gray-100"
                        >
                          <p className="text-lg font-bold text-blue-600">
                            {stat.v}
                          </p>
                          <p className="text-xs text-gray-500">{stat.l}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <motion.div
                className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-4 border border-gray-100"
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Verified
                    </p>
                    <p className="text-xs text-gray-500">100% secure</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-4 border border-gray-100"
                animate={{ y: [0, 8, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Star className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Top Rated
                    </p>
                    <p className="text-xs text-gray-500">4.9/5 average</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom stats row */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-20 pt-12 border-t border-gray-200/60"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 text-blue-600 mb-3">
                <stat.icon className="h-6 w-6" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {stat.value}
              </p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
