import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const testimonials = [
  {
    id: 1,
    name: "Fatma El-Sayed",
    role: "Patient",
    avatar: "FE",
    color: "bg-pink-500",
    rating: 5,
    text: "MedAppoint completely changed how I manage my health. I found an amazing cardiologist within minutes and booked an appointment the same day. The whole experience was seamless.",
  },
  {
    id: 2,
    name: "Mohamed Ibrahim",
    role: "Patient",
    avatar: "MI",
    color: "bg-blue-500",
    rating: 5,
    text: "As someone with a busy schedule, the ability to instantly see available slots and book online is a game-changer. No more waiting on hold or being put in a queue!",
  },
  {
    id: 3,
    name: "Dr. Layla Ahmed",
    role: "Dermatologist",
    avatar: "LA",
    color: "bg-purple-500",
    rating: 5,
    text: "From a doctor's perspective, this platform has streamlined my practice significantly. Patient management is effortless, and the scheduling system is incredibly intuitive.",
  },
  {
    id: 4,
    name: "Khaled Mansour",
    role: "Patient",
    avatar: "KM",
    color: "bg-emerald-500",
    rating: 4,
    text: "I was nervous about switching from my old clinic, but MedAppoint matched me with an even better specialist. The reviews and ratings really helped me make an informed decision.",
  },
  {
    id: 5,
    name: "Nour Hassan",
    role: "Patient",
    avatar: "NH",
    color: "bg-orange-500",
    rating: 5,
    text: "The follow-up reminders and easy rebooking feature ensure I never miss a check-up. This platform genuinely cares about patient health beyond just booking.",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const current = testimonials[currentIndex];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-blue-100/30 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-purple-100/30 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Hear from patients and doctors who have transformed their healthcare
            experience with MedAppoint.
          </p>
        </AnimatedSection>

        {/* Testimonial card */}
        <div className="max-w-3xl mx-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 p-8 sm:p-12 text-center relative"
            >
              {/* Quote icon */}
              <div className="absolute top-6 left-8 text-blue-100">
                <Quote className="h-12 w-12" />
              </div>

              {/* Stars */}
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < current.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-200"
                    }`}
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-700 text-lg leading-relaxed mb-8 relative z-10">
                &ldquo;{current.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center justify-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full ${current.color} flex items-center justify-center text-white font-bold text-sm shadow-md`}
                >
                  {current.avatar}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">{current.name}</p>
                  <p className="text-sm text-gray-500">{current.role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-200 hover:shadow-md transition-all duration-300"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentIndex
                      ? "w-8 bg-blue-600"
                      : "w-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-200 hover:shadow-md transition-all duration-300"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
