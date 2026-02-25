import { Link, useParams } from "react-router-dom";
import {
  useDoctorDetail,
  useDoctorAvailability,
} from "@/hooks/queries/useDoctors";
import PageTitle from "@/components/shared/PageTitle";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import Footer from "@/components/shared/Footer";
import { formatTime } from "@/lib/utils";
import { Heart, ArrowLeft, Calendar, Clock, Mail, Phone } from "lucide-react";

export default function DoctorDetail() {
  const { id } = useParams();
  const { data: doctor, isLoading } = useDoctorDetail(id);
  const { data: availability } = useDoctorAvailability(id);

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Heart className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold">MedAppoint</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
            >
              Register
            </Link>
          </nav>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          to="/doctors"
          className="flex items-center gap-1 text-sm text-primary hover:underline mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Doctors
        </Link>

        {isLoading ? (
          <LoadingSpinner />
        ) : !doctor ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Doctor not found.</p>
          </div>
        ) : (
          <div>
            {/* Doctor Info */}
            <div className="border rounded-lg p-6 bg-card mb-6">
              <h1 className="text-2xl font-bold">{doctor.user?.name}</h1>
              <p className="text-primary font-medium mt-1">
                {doctor.specialty?.name || "General"}
              </p>
              <p className="text-muted-foreground mt-3">
                {doctor.bio || "No bio available"}
              </p>

              <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                {doctor.user?.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {doctor.user.email}
                  </span>
                )}
                {doctor.user?.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {doctor.user.phone}
                  </span>
                )}
              </div>
            </div>

            {/* Availability Schedule */}
            <div className="border rounded-lg p-6 bg-card mb-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Weekly Schedule
              </h2>

              {!availability || availability.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No availability set yet.
                </p>
              ) : (
                <div className="grid gap-3">
                  {availability.map((day) => (
                    <div
                      key={day.day}
                      className="flex items-start gap-4 py-2 border-b last:border-0"
                    >
                      <span className="font-medium w-28 text-sm">
                        {day.day}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {day.slots.map((slot, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 text-sm bg-primary/10 text-primary px-3 py-1 rounded-full"
                          >
                            <Clock className="h-3 w-3" />
                            {formatTime(slot.startTime)} -{" "}
                            {formatTime(slot.endTime)}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90"
              >
                <Calendar className="h-4 w-4" />
                Sign in to Book Appointment
              </Link>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
