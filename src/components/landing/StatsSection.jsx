import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Stethoscope, Users, CalendarCheck, Award } from "lucide-react";

const stats = [
  {
    icon: Stethoscope,
    target: 500,
    suffix: "+",
    label: "Verified Doctors",
    description: "Across 30+ specialties",
  },
  {
    icon: Users,
    target: 10000,
    suffix: "+",
    label: "Happy Patients",
    description: "And counting daily",
  },
  {
    icon: CalendarCheck,
    target: 25000,
    suffix: "+",
    label: "Appointments",
    description: "Successfully completed",
  },
  {
    icon: Award,
    target: 98,
    suffix: "%",
    label: "Satisfaction",
    description: "From patient surveys",
  },
];

function AnimatedCounter({ target, suffix, shouldCount }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldCount) return;

    let start = 0;
    const duration = 2000;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [shouldCount, target]);

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + "k";
    }
    return num.toString();
  };

  return (
    <span>
      {formatNumber(count)}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-blue-400/10 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Trusted by Thousands
          </h2>
          <p className="text-blue-200 text-lg max-w-xl mx-auto">
            Our numbers speak for themselves — join a growing community of
            satisfied patients and healthcare professionals.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center group"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 mb-4 group-hover:bg-white/20 transition-colors duration-300">
                <stat.icon className="h-7 w-7 text-white" />
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-white mb-1">
                <AnimatedCounter
                  target={stat.target}
                  suffix={stat.suffix}
                  shouldCount={isInView}
                />
              </p>
              <p className="text-white font-medium mb-1">{stat.label}</p>
              <p className="text-blue-300 text-sm">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
