import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDoctorAppointments } from "@/hooks/queries/useAppointments";
import { useUpdateDoctorAppointment } from "@/hooks/mutations/useUpdateAppointment";
import { useStartConversation } from "@/hooks/mutations/useChatMutations";
import PageTitle from "@/components/shared/PageTitle";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";
import Pagination from "@/components/shared/Pagination";
import StatusBadge from "@/components/shared/StatusBadge";
import { formatDate, formatTime } from "@/lib/utils";
import { STATUS } from "@/lib/constants";
import { Check, X, CheckCircle, MessageSquare, StickyNote } from "lucide-react";

export default function DoctorAppointments() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const status = searchParams.get("status") || "";
  const [notesModal, setNotesModal] = useState(null);
  const [notes, setNotes] = useState("");

  const { data, isLoading } = useDoctorAppointments({
    page,
    limit: 10,
    ...(status && { status }),
  });

  const updateMutation = useUpdateDoctorAppointment();
  const startConversation = useStartConversation();

  const handleMessagePatient = (patientId) => {
    // appt.patient._id is the Patient profile _id the backend expects
    startConversation.mutate(patientId, {
      onSuccess: ({ data }) => {
        const convId = data?.data?._id;
        navigate(
          convId ? `/doctor/chat?conversation=${convId}` : "/doctor/chat",
        );
      },
    });
  };

  const handleStatusUpdate = (id, newStatus) => {
    updateMutation.mutate({ id, data: { status: newStatus } });
  };

  const handleAddNotes = (id) => {
    updateMutation.mutate(
      { id, data: { notes } },
      {
        onSuccess: () => {
          setNotesModal(null);
          setNotes("");
        },
      },
    );
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
        title="Appointments"
        description="Manage your patient appointments"
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
        <div className="space-y-3">
          {appointments.map((appt) => (
            <div key={appt._id} className="border rounded-lg p-4 bg-card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">
                      {appt.patient?.user?.name || "Patient"}
                    </p>
                    <StatusBadge status={appt.status} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(appt.date)} &bull; {formatTime(appt.startTime)}{" "}
                    - {formatTime(appt.endTime)}
                  </p>
                  {appt.patient?.user?.email && (
                    <p className="text-xs text-muted-foreground">
                      {appt.patient.user.email} &bull; {appt.patient.user.phone}
                    </p>
                  )}
                  {appt.patient?.medicalHistory && (
                    <p className="text-xs text-muted-foreground mt-1">
                      History: {appt.patient.medicalHistory}
                    </p>
                  )}
                  {appt.notes && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Notes: {appt.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {appt.status === "pending" && (
                    <>
                      <button
                        onClick={() =>
                          handleStatusUpdate(appt._id, "confirmed")
                        }
                        disabled={updateMutation.isPending}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                      >
                        <Check className="h-3 w-3" />
                        Confirm
                      </button>
                      <button
                        onClick={() =>
                          handleStatusUpdate(appt._id, "cancelled")
                        }
                        disabled={updateMutation.isPending}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                      >
                        <X className="h-3 w-3" />
                        Cancel
                      </button>
                    </>
                  )}
                  {appt.status === "confirmed" && (
                    <>
                      <button
                        onClick={() =>
                          handleStatusUpdate(appt._id, "completed")
                        }
                        disabled={updateMutation.isPending}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                      >
                        <CheckCircle className="h-3 w-3" />
                        Complete
                      </button>
                      <button
                        onClick={() =>
                          handleStatusUpdate(appt._id, "cancelled")
                        }
                        disabled={updateMutation.isPending}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                      >
                        <X className="h-3 w-3" />
                        Cancel
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => {
                      setNotesModal(appt._id);
                      setNotes(appt.notes || "");
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-md hover:bg-accent"
                  >
                    <StickyNote className="h-3 w-3" />
                    Notes
                  </button>
                  <button
                    onClick={() => handleMessagePatient(appt.patient._id)}
                    disabled={startConversation.isPending}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm border border-primary text-primary rounded-md hover:bg-primary/10 disabled:opacity-50"
                  >
                    <MessageSquare className="h-3 w-3" />
                    Message
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination pagination={pagination} onPageChange={handlePageChange} />

      {/* Notes Modal */}
      {notesModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Appointment Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Add notes for this appointment..."
              className="w-full border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-y"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setNotesModal(null);
                  setNotes("");
                }}
                className="px-4 py-2 text-sm border rounded-md hover:bg-accent"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAddNotes(notesModal)}
                disabled={updateMutation.isPending}
                className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
