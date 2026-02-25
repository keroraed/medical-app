import { useDoctorProfile } from "@/hooks/queries/useDoctors";
import { useDoctorAppointments } from "@/hooks/queries/useAppointments";
import PageTitle from "@/components/shared/PageTitle";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import StatusBadge from "@/components/shared/StatusBadge";
import { Calendar, User, Clock, ShieldCheck } from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils";
import { Link } from "react-router-dom";

export default function DoctorDashboard() {
  const { data: profile, isLoading: profileLoading } = useDoctorProfile();
  const { data: appointmentsData, isLoading: apptLoading } =
    useDoctorAppointments({ page: 1, limit: 5 });

  if (profileLoading || apptLoading) return <LoadingSpinner />;

  const appointments = appointmentsData?.data || [];

  return (
    <div>
      <PageTitle
        title={`Welcome, ${profile?.user?.name || "Doctor"}`}
        description="Here's an overview of your practice"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="border rounded-lg p-4 bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Specialty</p>
              <p className="font-medium">
                {profile?.specialty?.name || "Not set"}
              </p>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4 bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Total Appointments
              </p>
              <p className="font-medium">
                {appointmentsData?.pagination?.total || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4 bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <ShieldCheck className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Approval Status</p>
              <p className="font-medium">
                {profile?.isApproved ? (
                  <span className="text-green-600">Approved</span>
                ) : (
                  <span className="text-yellow-600">Pending Approval</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border rounded-lg bg-card">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">Recent Appointments</h3>
          <Link
            to="/doctor/appointments"
            className="text-sm text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        {appointments.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No appointments yet.
          </div>
        ) : (
          <div className="divide-y">
            {appointments.map((appt) => (
              <div
                key={appt._id}
                className="p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">
                    {appt.patient?.user?.name || "Patient"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(appt.date)} &bull; {formatTime(appt.startTime)}{" "}
                    - {formatTime(appt.endTime)}
                  </p>
                </div>
                <StatusBadge status={appt.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
