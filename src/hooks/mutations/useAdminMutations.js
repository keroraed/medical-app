import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";
import { adminUserKeys } from "@/hooks/queries/useAdmin";
import { doctorKeys } from "@/hooks/queries/useDoctors";
import { specialtyKeys } from "@/hooks/queries/useSpecialties";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";

export function useBlockUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => adminApi.blockUser(id),
    onSuccess: () => {
      toast.success("User status updated");
      queryClient.invalidateQueries({ queryKey: adminUserKeys.all });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useApproveDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => adminApi.approveDoctor(id),
    onSuccess: () => {
      toast.success("Doctor approved successfully!");
      queryClient.invalidateQueries({ queryKey: doctorKeys.adminAll() });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useCreateSpecialty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => adminApi.createSpecialty(data),
    onSuccess: () => {
      toast.success("Specialty created!");
      queryClient.invalidateQueries({ queryKey: specialtyKeys.all });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useUpdateSpecialty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => adminApi.updateSpecialty(id, data),
    onSuccess: () => {
      toast.success("Specialty updated!");
      queryClient.invalidateQueries({ queryKey: specialtyKeys.all });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useDeleteSpecialty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => adminApi.deleteSpecialty(id),
    onSuccess: () => {
      toast.success("Specialty deleted!");
      queryClient.invalidateQueries({ queryKey: specialtyKeys.all });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}
