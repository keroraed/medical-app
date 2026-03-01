import { useAdminDoctors } from "@/hooks/queries/useDoctors";
import { useApproveDoctor } from "@/hooks/mutations/useAdminMutations";
import PageTitle from "@/components/shared/PageTitle";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";
import { ShieldCheck } from "lucide-react";

export default function DoctorsApproval() {
  const { data, isLoading } = useAdminDoctors();
  const approveMutation = useApproveDoctor();

  if (isLoading) return <LoadingSpinner />;

  const doctors = data?.data || [];
  const pendingDoctors = doctors.filter((d) => !d.isApproved);
  const approvedDoctors = doctors.filter((d) => d.isApproved);

  return (
    <div>
      <PageTitle
        title="Doctor Approvals"
        description="Review and approve doctor registrations"
      />

      {/* Pending */}
      <div className="mb-8">
        <h3 className="font-semibold text-lg mb-4">
          Pending Approval ({pendingDoctors.length})
        </h3>
        {pendingDoctors.length === 0 ? (
          <EmptyState
            title="No pending doctors"
            description="All doctor registrations have been reviewed."
          />
        ) : (
          <div className="grid gap-4">
            {pendingDoctors.map((doc) => (
              <div
                key={doc._id}
                className="border rounded-lg p-4 bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <p className="font-medium">{doc.user?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {doc.user?.email} &bull;{" "}
                    {doc.specialty?.name || "No specialty"}
                  </p>
                  {doc.bio && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {doc.bio}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => approveMutation.mutate(doc._id)}
                  disabled={approveMutation.isPending}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 text-sm"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Approve
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Approved */}
      <div>
        <h3 className="font-semibold text-lg mb-4">
          Approved Doctors ({approvedDoctors.length})
        </h3>
        {approvedDoctors.length === 0 ? (
          <EmptyState
            title="No approved doctors"
            description="No doctors have been approved yet."
          />
        ) : (
          <div className="grid gap-3">
            {approvedDoctors.map((doc) => (
              <div
                key={doc._id}
                className="border rounded-lg p-4 bg-card flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{doc.user?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {doc.user?.email} &bull;{" "}
                    {doc.specialty?.name || "No specialty"}
                  </p>
                </div>
                <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  Approved
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
