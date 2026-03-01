import { useSearchParams } from "react-router-dom";
import { useAdminUsers } from "@/hooks/queries/useAdmin";
import { useBlockUser } from "@/hooks/mutations/useAdminMutations";
import PageTitle from "@/components/shared/PageTitle";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";
import Pagination from "@/components/shared/Pagination";
import { formatDate } from "@/lib/utils";
import { Ban, CheckCircle } from "lucide-react";

export default function UsersManagement() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const role = searchParams.get("role") || "";

  const { data, isLoading } = useAdminUsers({ page, limit: 10, role });
  const blockMutation = useBlockUser();

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => {
      prev.set("page", newPage.toString());
      return prev;
    });
  };

  const handleRoleFilter = (newRole) => {
    setSearchParams((prev) => {
      if (newRole) {
        prev.set("role", newRole);
      } else {
        prev.delete("role");
      }
      prev.set("page", "1");
      return prev;
    });
  };

  if (isLoading) return <LoadingSpinner />;

  const users = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div>
      <PageTitle
        title="Users Management"
        description="View and manage all users"
      />

      <div className="flex flex-wrap gap-2 mb-6">
        {["", "patient", "doctor", "admin"].map((r) => (
          <button
            key={r}
            onClick={() => handleRoleFilter(r)}
            className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
              role === r
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            }`}
          >
            {r || "All"}
          </button>
        ))}
      </div>

      {users.length === 0 ? (
        <EmptyState
          title="No users"
          description="No users match this filter."
        />
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium">Name</th>
                  <th className="text-left p-3 font-medium">Email</th>
                  <th className="text-left p-3 font-medium">Role</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Joined</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-muted/30">
                    <td className="p-3 font-medium">{user.name}</td>
                    <td className="p-3 text-muted-foreground">{user.email}</td>
                    <td className="p-3">
                      <span className="capitalize px-2 py-0.5 rounded-full text-xs bg-secondary">
                        {user.role}
                      </span>
                    </td>
                    <td className="p-3">
                      {user.isActive ? (
                        <span className="text-green-600 text-xs font-medium">
                          Active
                        </span>
                      ) : (
                        <span className="text-red-600 text-xs font-medium">
                          Blocked
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => blockMutation.mutate(user._id)}
                        disabled={blockMutation.isPending}
                        className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md ${
                          user.isActive
                            ? "text-red-600 border border-red-200 hover:bg-red-50"
                            : "text-green-600 border border-green-200 hover:bg-green-50"
                        }`}
                      >
                        {user.isActive ? (
                          <>
                            <Ban className="h-3 w-3" /> Block
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-3 w-3" /> Unblock
                          </>
                        )}
                      </button>
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
