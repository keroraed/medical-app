import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useDoctorDetail,
  useDoctorAvailability,
} from "@/hooks/queries/useDoctors";
import PageTitle from "@/components/shared/PageTitle";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import Footer from "@/components/shared/Footer";
import PublicNavbar from "@/components/shared/PublicNavbar";
import { formatTime, getProfilePicUrl } from "@/lib/utils";
import { ArrowLeft, Calendar, Clock, Mail, MessageSquare, Phone, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ROLES } from "@/lib/constants";
import { useStartConversation } from "@/hooks/mutations/useChatMutations";

export default function DoctorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: doctor, isLoading } = useDoctorDetail(id);
  const { data: availability } = useDoctorAvailability(id);
  const { isAuthenticated, role } = useAuth();
  const startConversation = useStartConversation();

  const handleMessage = () => {
    // doctor._id is the DoctorProfile _id — exactly what the API expects
    startConversation.mutate(doctor._id, {
      onSuccess: ({ data }) => {
        const convId = data?.data?._id;
        navigate(
          convId ? `/patient/chat?conversation=${convId}` : "/patient/chat",
        );
      },
    });
  };

  return (
    <div className="min-h-screen">
      <PublicNavbar />

      <div className="max-w-4xl mx-auto px-4 pt-24 pb-8">
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
              <div className="flex items-start gap-5 mb-4">
                {/* Profile picture */}
                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-md shrink-0 border border-gray-100">
                  {doctor.profilePicture ? (
                    <img
                      src={getProfilePicUrl(doctor.profilePicture)}
                      alt={doctor.user?.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <User className="h-9 w-9 text-white/70" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl font-bold">{doctor.user?.name}</h1>
                    {isAuthenticated && role === ROLES.PATIENT && doctor.isApproved && (
                      <button
                        onClick={handleMessage}
                        disabled={startConversation.isPending}
                        title="Message this doctor"
                        className="h-8 w-8 flex items-center justify-center rounded-full border border-primary text-primary hover:bg-primary/10 disabled:opacity-50 transition-colors"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-primary font-medium mt-1">
                    {doctor.specialty?.name || "General"}
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground">
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
            <div className="flex flex-wrap justify-center gap-3">
              {isAuthenticated && role === ROLES.PATIENT ? (
                <>
                  <Link
                    to={`/patient/book?doctor=${id}`}
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90"
                  >
                    <Calendar className="h-4 w-4" />
                    Book Appointment
                  </Link>
                  {doctor.isApproved && (
                    <button
                      onClick={handleMessage}
                      disabled={startConversation.isPending}
                      className="inline-flex items-center gap-2 border border-primary text-primary px-6 py-3 rounded-md hover:bg-primary/10 disabled:opacity-50"
                    >
                      <MessageSquare className="h-4 w-4" />
                      {startConversation.isPending ? "Opening…" : "Message"}
                    </button>
                  )}
                </>
              ) : !isAuthenticated ? (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90"
                >
                  <Calendar className="h-4 w-4" />
                  Sign in to Book Appointment
                </Link>
              ) : null}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
