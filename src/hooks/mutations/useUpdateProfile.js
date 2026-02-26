import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patientApi } from "@/api/patient.api";
import { doctorApi } from "@/api/doctor.api";
import { patientProfileKeys } from "@/hooks/queries/usePatientProfile";
import { doctorKeys } from "@/hooks/queries/useDoctors";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";

export function useUpdatePatientProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => patientApi.updateProfile(data),
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: patientProfileKeys.all });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useUpdateDoctorProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => doctorApi.updateProfile(data),
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: doctorKeys.profile() });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useUploadProfilePicture() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file) => doctorApi.uploadProfilePicture(file),
    onSuccess: () => {
      toast.success("Profile picture updated!");
      queryClient.invalidateQueries({ queryKey: doctorKeys.profile() });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
