import { useSearchParams } from "react-router-dom";
import { useAdminAppointments } from "@/hooks/queries/useAppointments";
import PageTitle from "@/components/shared/PageTitle";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";
import Pagination from "@/components/shared/Pagination";
import StatusBadge from "@/components/shared/StatusBadge";
import { formatDate, formatTime } from "@/lib/utils";
import { STATUS } from "@/lib/constants";

export default function AppointmentsOverview() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const status = searchParams.get("status") || "";

  const { data, isLoading } = useAdminAppointments({
    page,
    limit: 10,
    ...(status && { status }),
  });

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
        title="All Appointments"
        description="Overview of all appointments in the system"
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
          description="No appointments match this filter."
        />
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium">Patient</th>
                  <th className="text-left p-3 font-medium">Doctor</th>
                  <th className="text-left p-3 font-medium">Date</th>
                  <th className="text-left p-3 font-medium">Time</th>
                  <th className="text-left p-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {appointments.map((appt) => (
                  <tr key={appt._id} className="hover:bg-muted/30">
                    <td className="p-3">
                      <p className="font-medium">
                        {appt.patient?.user?.name || "N/A"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {appt.patient?.user?.email}
                      </p>
                    </td>
                    <td className="p-3">
                      <p className="font-medium">
                        {appt.doctor?.user?.name || "N/A"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {appt.doctor?.user?.email}
                      </p>
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {formatDate(appt.date)}
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {formatTime(appt.startTime)} - {formatTime(appt.endTime)}
                    </td>
                    <td className="p-3">
                      <StatusBadge status={appt.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Pagination pagination={pagination} onPageChange={handlePageChange} />
    </div>
  );
}
