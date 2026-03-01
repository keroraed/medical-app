import { usePatientProfile } from "@/hooks/queries/usePatientProfile";
import { useUpdatePatientProfile } from "@/hooks/mutations/useUpdateProfile";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import PageTitle from "@/components/shared/PageTitle";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import FormField from "@/components/forms/FormField";
import { Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

const patientProfileSchema = z.object({
  medicalHistory: z
    .string()
    .max(2000, "Medical history must be 2000 characters or less")
    .optional()
    .or(z.literal("")),
});

export default function PatientProfile() {
  const { data: profile, isLoading } = usePatientProfile();
  const updateMutation = useUpdatePatientProfile();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(patientProfileSchema),
  });

  useEffect(() => {
    if (profile) {
      reset({ medicalHistory: profile.medicalHistory || "" });
    }
  }, [profile, reset]);

  if (isLoading) return <LoadingSpinner />;

  const user = profile?.user;

  const onSubmit = (data) => updateMutation.mutate(data);

  return (
    <div>
      <PageTitle
        title="My Profile"
        description="View and update your profile"
      />

      {/* User info (read-only) */}
      <div className="border rounded-lg p-6 bg-card mb-6">
        <h3 className="font-semibold mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Name:</span>{" "}
            <span className="font-medium">{user?.name}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Email:</span>{" "}
            <span className="font-medium">{user?.email}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Phone:</span>{" "}
            <span className="font-medium">{user?.phone}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Gender:</span>{" "}
            <span className="font-medium capitalize">{user?.gender}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Date of Birth:</span>{" "}
            <span className="font-medium">{formatDate(user?.dateOfBirth)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Address:</span>{" "}
            <span className="font-medium">{user?.address || "N/A"}</span>
          </div>
        </div>
      </div>

      {/* Medical History (editable) */}
      <div className="border rounded-lg p-6 bg-card">
        <h3 className="font-semibold mb-4">Medical History</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Medical History" htmlFor="medical-history" error={errors.medicalHistory}>
            <textarea
              id="medical-history"
              {...register("medicalHistory")}
              rows={4}
              placeholder="Enter your medical history, allergies, current medications..."
              className="w-full border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-y"
            />
          </FormField>
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
          >
            {updateMutation.isPending && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            Update Medical History
          </button>
        </form>
      </div>
    </div>
  );
}
