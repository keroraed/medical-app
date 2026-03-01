import { useState } from "react";
import { useAdminSpecialties } from "@/hooks/queries/useSpecialties";
import {
  useCreateSpecialty,
  useUpdateSpecialty,
  useDeleteSpecialty,
} from "@/hooks/mutations/useAdminMutations";
import PageTitle from "@/components/shared/PageTitle";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Plus, Pencil, Trash2, Loader2, X } from "lucide-react";

export default function SpecialtiesManagement() {
  const { data: specialties, isLoading } = useAdminSpecialties();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const createMutation = useCreateSpecialty();
  const updateMutation = useUpdateSpecialty();
  const deleteMutation = useDeleteSpecialty();

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setName("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      updateMutation.mutate(
        { id: editingId, data: { name: name.trim() } },
        { onSuccess: resetForm },
      );
    } else {
      createMutation.mutate({ name: name.trim() }, { onSuccess: resetForm });
    }
  };

  const handleEdit = (specialty) => {
    setEditingId(specialty._id);
    setName(specialty.name);
    setShowForm(true);
  };

  const handleDelete = (id) => setDeleteTargetId(id);

  const handleConfirmDelete = () => {
    deleteMutation.mutate(deleteTargetId, {
      onSettled: () => setDeleteTargetId(null),
    });
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageTitle
          title="Specialties"
          description="Manage medical specialties"
        />
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm"
          >
            <Plus className="h-4 w-4" />
            Add Specialty
          </button>
        )}
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div className="border rounded-lg p-4 bg-card mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">
              {editingId ? "Edit Specialty" : "New Specialty"}
            </h3>
            <button
              onClick={resetForm}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Specialty name"
              className="flex-1 border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              autoFocus
            />
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2 text-sm"
            >
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              {editingId ? "Update" : "Create"}
            </button>
          </form>
        </div>
      )}

      {/* List */}
      {!specialties || specialties.length === 0 ? (
        <EmptyState
          title="No specialties"
          description="Add your first medical specialty."
        />
      ) : (
        <div className="border rounded-lg divide-y">
          {specialties.map((specialty) => (
            <div
              key={specialty._id}
              className="flex items-center justify-between p-4 hover:bg-muted/30"
            >
              <span className="font-medium">{specialty.name}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(specialty)}
                  className="p-1.5 text-muted-foreground hover:text-primary rounded-md hover:bg-accent"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(specialty._id)}
                  disabled={deleteMutation.isPending}
                  className="p-1.5 text-muted-foreground hover:text-destructive rounded-md hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title="Delete specialty?"
        description="This specialty will be permanently deleted and cannot be recovered."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
        confirmLabel="Delete"
      />
    </div>
  );
}
