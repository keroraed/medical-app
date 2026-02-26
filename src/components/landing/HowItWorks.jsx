import { motion } from "framer-motion";
import { Search, CalendarCheck, HeartPulse } from "lucide-react";
import AnimatedSection, {
  StaggerContainer,
  staggerChild,
} from "./AnimatedSection";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Search a Doctor",
    description:
      "Browse our extensive network of verified specialists. Filter by specialty, location, availability, and patient ratings to find your perfect match.",
    color: "from-blue-500 to-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    icon: CalendarCheck,
    step: "02",
    title: "Book Appointment",
    description:
      "Choose a convenient date and time slot that works for you. Our real-time scheduling ensures you get instant confirmation.",
    color: "from-emerald-500 to-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  {
    icon: HeartPulse,
    step: "03",
    title: "Get Treatment",
    description:
      "Visit your doctor at the scheduled time. Receive expert medical care and follow-up support through our platform.",
    color: "from-purple-500 to-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-100",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white relative">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Getting quality healthcare has never been easier. Follow these three
            simple steps and you&apos;re all set.
          </p>
        </AnimatedSection>

        {/* Steps */}
        <StaggerContainer className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line - desktop only */}
          <div className="hidden md:block absolute top-24 left-[16.6%] right-[16.6%] h-0.5 bg-gradient-to-r from-blue-200 via-emerald-200 to-purple-200" />

          {steps.map((step) => (
            <motion.div
              key={step.step}
              variants={staggerChild}
              className="relative group"
            >
              <div
                className={`relative ${step.bg} ${step.border} border rounded-2xl p-8 text-center hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 hover:-translate-y-1`}
              >
                {/* Step number */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-md text-xs font-bold text-gray-500 border border-gray-100">
                    {step.step}
                  </span>
                </div>

                {/* Icon */}
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} shadow-lg mb-6 mt-2`}
                >
                  <step.icon className="h-8 w-8 text-white" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
