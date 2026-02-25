import { useState, useEffect } from "react";
import { useDoctorProfile } from "@/hooks/queries/useDoctors";
import { useSpecialties } from "@/hooks/queries/useSpecialties";
import { useUpdateDoctorProfile } from "@/hooks/mutations/useUpdateProfile";
import { useForm } from "react-hook-form";
import PageTitle from "@/components/shared/PageTitle";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import FormField from "@/components/forms/FormField";
import AvailabilityEditor from "@/components/forms/AvailabilityEditor";
import { Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function DoctorProfile() {
  const { data: profile, isLoading } = useDoctorProfile();
  const { data: specialties } = useSpecialties();
  const updateMutation = useUpdateDoctorProfile();

  const [availability, setAvailability] = useState([]);

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (profile) {
      reset({
        specialty: profile.specialty?._id || "",
        bio: profile.bio || "",
      });
      setAvailability(profile.availability || []);
    }
  }, [profile, reset]);

  if (isLoading) return <LoadingSpinner />;

  const user = profile?.user;

  const onSubmit = (data) => {
    updateMutation.mutate({
      ...data,
      availability,
    });
  };

  return (
    <div>
      <PageTitle
        title="My Profile"
        description="Manage your professional profile and availability"
      />

      {/* Personal info (read-only) */}
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
            <span className="text-muted-foreground">Approval:</span>{" "}
            <span
              className={`font-medium ${
                profile?.isApproved ? "text-green-600" : "text-yellow-600"
              }`}
            >
              {profile?.isApproved ? "Approved" : "Pending Approval"}
            </span>
          </div>
        </div>
      </div>

      {/* Professional info (editable) */}
      <div className="border rounded-lg p-6 bg-card">
        <h3 className="font-semibold mb-4">Professional Details</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Specialty">
            <select
              {...register("specialty")}
              className="w-full border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select specialty...</option>
              {specialties?.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Bio">
            <textarea
              {...register("bio")}
              rows={3}
              placeholder="Describe your qualifications and experience..."
              className="w-full border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-y"
            />
          </FormField>

          <AvailabilityEditor
            availability={availability}
            onChange={setAvailability}
          />

          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
          >
            {updateMutation.isPending && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
