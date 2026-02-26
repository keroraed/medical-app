import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Footer from "@/components/shared/Footer";
import PublicNavbar from "@/components/shared/PublicNavbar";
import { Calendar, Shield, Stethoscope, ArrowRight } from "lucide-react";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      <PublicNavbar />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Your Health, Our Priority
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Book appointments with top doctors in seconds. Manage your healthcare
          journey with our easy-to-use platform.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/doctors"
            className="bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 flex items-center gap-2"
          >
            Browse Doctors
            <ArrowRight className="h-4 w-4" />
          </Link>
          {!isAuthenticated && (
            <Link
              to="/register"
              className="border px-6 py-3 rounded-md hover:bg-accent"
            >
              Create Account
            </Link>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="inline-flex p-3 bg-primary/10 rounded-lg mb-4">
              <Stethoscope className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Expert Doctors</h3>
            <p className="text-muted-foreground text-sm">
              Browse verified doctors across multiple specialties and find the
              right match for your needs.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="inline-flex p-3 bg-primary/10 rounded-lg mb-4">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Easy Booking</h3>
            <p className="text-muted-foreground text-sm">
              View doctor availability in real-time and book appointments with
              just a few clicks.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="inline-flex p-3 bg-primary/10 rounded-lg mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Secure & Private</h3>
            <p className="text-muted-foreground text-sm">
              Your health data is protected with industry-standard security.
              Your privacy comes first.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
