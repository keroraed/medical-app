import PublicNavbar from "@/components/shared/PublicNavbar";
import Footer from "@/components/shared/Footer";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import FeaturedDoctors from "@/components/landing/FeaturedDoctors";
import SpecialtiesSection from "@/components/landing/SpecialtiesSection";
import StatsSection from "@/components/landing/StatsSection";
import Testimonials from "@/components/landing/Testimonials";
import CTASection from "@/components/landing/CTASection";
import ScrollToTop from "@/components/landing/ScrollToTop";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />
      <HeroSection />
      <SpecialtiesSection />
      <HowItWorks />
      <FeaturedDoctors />
      <StatsSection />
      <Testimonials />
      <CTASection />
      <Footer />
      <ScrollToTop />
    </div>
  );
}
