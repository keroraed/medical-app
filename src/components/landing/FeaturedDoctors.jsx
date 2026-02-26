import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedSection from "./AnimatedSection";

const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    rating: 4.9,
    reviews: 127,
    experience: "15 years",
    avatar: "SJ",
    color: "from-blue-500 to-blue-600",
  },
  {
    id: 2,
    name: "Dr. Ahmed Hassan",
    specialty: "Dermatologist",
    rating: 4.8,
    reviews: 94,
    experience: "12 years",
    avatar: "AH",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    id: 3,
    name: "Dr. Maria Chen",
    specialty: "Neurologist",
    rating: 4.9,
    reviews: 156,
    experience: "18 years",
    avatar: "MC",
    color: "from-purple-500 to-purple-600",
  },
  {
    id: 4,
    name: "Dr. Omar Khaled",
    specialty: "Orthopedic",
    rating: 4.7,
    reviews: 83,
    experience: "10 years",
    avatar: "OK",
    color: "from-orange-500 to-orange-600",
  },
  {
    id: 5,
    name: "Dr. Emily Davis",
    specialty: "Pediatrician",
    rating: 4.9,
    reviews: 201,
    experience: "20 years",
    avatar: "ED",
    color: "from-pink-500 to-pink-600",
  },
  {
    id: 6,
    name: "Dr. Youssef Ali",
    specialty: "Ophthalmologist",
    rating: 4.8,
    reviews: 112,
    experience: "14 years",
    avatar: "YA",
    color: "from-cyan-500 to-cyan-600",
  },
];

export default function FeaturedDoctors() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Number of visible cards based on screen (we always show container and let CSS handle responsiveness)
  const visibleCount = 3;
  const maxIndex = doctors.length - visibleCount;

  const next = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  // Auto-slide
  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  const visibleDoctors = doctors.slice(
    currentIndex,
    currentIndex + visibleCount
  );

  // If we're near the end, wrap around
  if (visibleDoctors.length < visibleCount) {
    visibleDoctors.push(
      ...doctors.slice(0, visibleCount - visibleDoctors.length)
    );
  }

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimatedSection className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
              Top Professionals
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Featured Doctors
            </h2>
            <p className="text-gray-600 max-w-lg">
              Meet our highest-rated medical professionals trusted by thousands
              of patients.
            </p>
          </div>
          <Link
            to="/doctors"
            className="group inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 mt-4 sm:mt-0 transition-colors"
          >
            View All Doctors
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </AnimatedSection>

        {/* Carousel */}
        <div className="relative">
          {/* Navigation buttons */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-lg shadow-gray-200/50 border border-gray-100 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:shadow-xl transition-all duration-300 hidden md:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-lg shadow-gray-200/50 border border-gray-100 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:shadow-xl transition-all duration-300 hidden md:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:px-4">
            <AnimatePresence mode="popLayout" initial={false}>
              {visibleDoctors.map((doctor, i) => (
                <motion.div
                  key={`${doctor.id}-${currentIndex}`}
                  initial={{ opacity: 0, x: direction * 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -50 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="group"
                >
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 hover:-translate-y-1">
                    <div className="flex items-start gap-4 mb-4">
                      {/* Avatar */}
                      <div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${doctor.color} flex items-center justify-center text-white font-bold text-lg shadow-md`}
                      >
                        {doctor.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-lg truncate">
                          {doctor.name}
                        </h3>
                        <p className="text-blue-600 text-sm font-medium">
                          {doctor.specialty}
                        </p>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-yellow-50 border border-yellow-100">
                        <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-semibold text-yellow-700">
                          {doctor.rating}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        ({doctor.reviews} reviews)
                      </span>
                      <span className="text-xs text-gray-400 ml-auto">
                        {doctor.experience} exp
                      </span>
                    </div>

                    {/* CTA */}
                    <Link
                      to="/doctors"
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 border border-blue-100 hover:border-blue-600"
                    >
                      Book Appointment
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > currentIndex ? 1 : -1);
                  setCurrentIndex(i);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? "w-8 bg-blue-600"
                    : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
