import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { usePatientAppointments } from "@/hooks/queries/useAppointments";
import { useUpdatePatientAppointment } from "@/hooks/mutations/useUpdateAppointment";
import PageTitle from "@/components/shared/PageTitle";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";
import Pagination from "@/components/shared/Pagination";
import StatusBadge from "@/components/shared/StatusBadge";
import { formatDate, formatTime } from "@/lib/utils";
import { STATUS } from "@/lib/constants";
import { XCircle } from "lucide-react";

export default function PatientAppointments() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const status = searchParams.get("status") || "";

  const { data, isLoading } = usePatientAppointments({
    page,
    limit: 10,
    ...(status && { status }),
  });

  const cancelMutation = useUpdatePatientAppointment();

  const handleCancel = (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      cancelMutation.mutate({ id, data: { status: "cancelled" } });
    }
  };

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => {
      prev.set("page", newPage.toString());
      return prev;
    });
  };

  const handleStatusFilter = (newStatus) => {
    setSearchParams((prev) => {
      if (newStatus) {
        prev.set("status", newStatus);
      } else {
        prev.delete("status");
      }
      prev.set("page", "1");
      return prev;
    });
  };

  if (isLoading) return <LoadingSpinner />;

  const appointments = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div>
      <PageTitle
        title="My Appointments"
        description="View and manage your appointments"
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          "",
          STATUS.PENDING,
          STATUS.CONFIRMED,
          STATUS.CANCELLED,
          STATUS.COMPLETED,
        ].map((s) => (
          <button
            key={s}
            onClick={() => handleStatusFilter(s)}
            className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
              status === s
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            }`}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      {appointments.length === 0 ? (
        <EmptyState
          title="No appointments"
          description="You have no appointments matching this filter."
        />
      ) : (
        <div className="space-y-3">
          {appointments.map((appt) => (
            <div
              key={appt._id}
              className="border rounded-lg p-4 bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium">
                    {appt.doctor?.user?.name || "Doctor"}
                  </p>
                  <StatusBadge status={appt.status} />
                </div>
                <p className="text-sm text-muted-foreground">
                  {appt.doctor?.specialty?.name || "General"} &bull;{" "}
                  {formatDate(appt.date)} &bull; {formatTime(appt.startTime)} -{" "}
                  {formatTime(appt.endTime)}
                </p>
                {appt.notes && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Notes: {appt.notes}
                  </p>
                )}
              </div>
              {(appt.status === "pending" || appt.status === "confirmed") && (
                <button
                  onClick={() => handleCancel(appt._id)}
                  disabled={cancelMutation.isPending}
                  className="flex items-center gap-1 text-sm text-destructive hover:underline disabled:opacity-50"
                >
                  <XCircle className="h-4 w-4" />
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <Pagination pagination={pagination} onPageChange={handlePageChange} />
    </div>
  );
}
