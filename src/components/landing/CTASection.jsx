import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

export default function CTASection() {
  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-10 sm:p-16 text-center">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 blur-2xl translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-blue-400/10 blur-2xl -translate-x-1/3 translate-y-1/3" />

            <div className="relative z-10">
              <motion.h2
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Ready to Take Control of{" "}
                <br className="hidden sm:block" />
                Your Health Journey?
              </motion.h2>

              <motion.p
                className="text-blue-200 text-lg max-w-2xl mx-auto mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Join thousands of patients who have already discovered a better
                way to manage their healthcare. It&apos;s free to create an
                account.
              </motion.p>

              <motion.div
                className="flex flex-wrap items-center justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Link
                  to="/register"
                  className="group inline-flex items-center gap-2 bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold text-base shadow-lg shadow-blue-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                >
                  Get Started Free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-white/90 px-6 py-4 rounded-xl font-semibold text-base border border-white/20 hover:bg-white/10 transition-all duration-300"
                >
                  <Phone className="h-4 w-4" />
                  Contact Us
                </a>
              </motion.div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
