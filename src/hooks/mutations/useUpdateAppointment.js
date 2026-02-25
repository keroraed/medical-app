import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patientApi } from "@/api/patient.api";
import { doctorApi } from "@/api/doctor.api";
import { appointmentKeys } from "@/hooks/queries/useAppointments";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";

export function useUpdatePatientAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => patientApi.updateAppointment(id, data),
    onSuccess: () => {
      toast.success("Appointment updated successfully!");
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useUpdateDoctorAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => doctorApi.updateAppointment(id, data),
    onSuccess: () => {
      toast.success("Appointment updated successfully!");
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
