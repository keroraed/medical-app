import { useQuery } from "@tanstack/react-query";
import { patientApi } from "@/api/patient.api";

export const patientProfileKeys = {
  all: ["patientProfile"],
  detail: () => ["patientProfile", "detail"],
};

export function usePatientProfile() {
  return useQuery({
    queryKey: patientProfileKeys.detail(),
    queryFn: async () => {
      const { data } = await patientApi.getProfile();
      return data.data;
    },
  });
}
