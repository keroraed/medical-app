import { useState, useEffect, useRef } from "react";
import { useDoctorProfile } from "@/hooks/queries/useDoctors";
import { useSpecialties } from "@/hooks/queries/useSpecialties";
import {
  useUpdateDoctorProfile,
  useUploadProfilePicture,
} from "@/hooks/mutations/useUpdateProfile";
import { useForm } from "react-hook-form";
import PageTitle from "@/components/shared/PageTitle";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import FormField from "@/components/forms/FormField";
import AvailabilityEditor from "@/components/forms/AvailabilityEditor";
import { Loader2, Camera, User } from "lucide-react";
import { formatDate, getProfilePicUrl } from "@/lib/utils";
import { toast } from "sonner";

export default function DoctorProfile() {
  const { data: profile, isLoading } = useDoctorProfile();
  const { data: specialties } = useSpecialties();
  const updateMutation = useUpdateDoctorProfile();
  const uploadMutation = useUploadProfilePicture();
  const fileInputRef = useRef(null);

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

  const handlePictureChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPEG, PNG, and WebP images are allowed.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File too large. Maximum size is 2 MB.");
      return;
    }

    uploadMutation.mutate(file);
    e.target.value = "";
  };

  const profilePicUrl = getProfilePicUrl(profile?.profilePicture);

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

        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Profile picture */}
          <div className="relative group shrink-0">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-muted border-2 border-border shadow-sm">
              {profilePicUrl ? (
                <img
                  src={profilePicUrl}
                  alt={user?.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                  <User className="h-10 w-10 text-primary/40" />
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadMutation.isPending}
              className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-primary/90 transition-all border-2 border-background disabled:opacity-50"
              title="Change profile picture"
            >
              {uploadMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePictureChange}
              className="hidden"
            />
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm flex-1">
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
      </div>

      {/* Professional info (editable) */}
      <div className="border rounded-lg p-6 bg-card">
        <h3 className="font-semibold mb-4">Professional Details</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Specialty" htmlFor="doc-specialty">
            <select
              id="doc-specialty"
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

          <FormField label="Bio" htmlFor="doc-bio">
            <textarea
              id="doc-bio"
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
