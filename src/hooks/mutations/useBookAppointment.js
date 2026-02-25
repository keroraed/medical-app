import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentApi } from "@/api/appointment.api";
import { appointmentKeys } from "@/hooks/queries/useAppointments";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";

export function useBookAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => appointmentApi.book(data),
    onSuccess: () => {
      toast.success("Appointment booked successfully!");
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
