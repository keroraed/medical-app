import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Heart,
  Brain,
  Eye,
  Baby,
  Bone,
  Pill,
  Microscope,
  Stethoscope,
} from "lucide-react";
import AnimatedSection, {
  StaggerContainer,
  staggerChild,
} from "./AnimatedSection";

const specialties = [
  { icon: Heart, name: "Cardiology", color: "from-red-500 to-rose-500", bg: "bg-red-50" },
  { icon: Brain, name: "Neurology", color: "from-purple-500 to-violet-500", bg: "bg-purple-50" },
  { icon: Eye, name: "Ophthalmology", color: "from-cyan-500 to-teal-500", bg: "bg-cyan-50" },
  { icon: Baby, name: "Pediatrics", color: "from-pink-500 to-rose-400", bg: "bg-pink-50" },
  { icon: Bone, name: "Orthopedics", color: "from-orange-500 to-amber-500", bg: "bg-orange-50" },
  { icon: Pill, name: "Dermatology", color: "from-emerald-500 to-green-500", bg: "bg-emerald-50" },
  { icon: Microscope, name: "Pathology", color: "from-indigo-500 to-blue-500", bg: "bg-indigo-50" },
  { icon: Stethoscope, name: "General", color: "from-blue-500 to-sky-500", bg: "bg-blue-50" },
];

export default function SpecialtiesSection() {
  return (
    <section className="py-24 bg-gray-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
            Specialties
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Browse by Specialty
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Find the right specialist for your needs across our comprehensive
            range of medical fields.
          </p>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {specialties.map((spec) => (
            <motion.div key={spec.name} variants={staggerChild}>
              <Link
                to="/doctors"
                className={`group flex flex-col items-center gap-3 p-6 rounded-2xl ${spec.bg} border border-transparent hover:border-gray-200 hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 hover:-translate-y-1`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${spec.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <spec.icon className="h-7 w-7 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                  {spec.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
