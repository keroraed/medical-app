import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";
import PageTitle from "@/components/shared/PageTitle";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Users, Calendar, Stethoscope, ShieldCheck } from "lucide-react";

export default function AdminDashboard() {
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["admin", "users", "stats"],
    queryFn: async () => {
      const { data } = await adminApi.getUsers({ page: 1, limit: 1 });
      return data;
    },
  });

  const { data: appointmentsData, isLoading: apptLoading } = useQuery({
    queryKey: ["admin", "appointments", "stats"],
    queryFn: async () => {
      const { data } = await adminApi.getAppointments({ page: 1, limit: 1 });
      return data;
    },
  });

  const { data: specialtiesData, isLoading: specLoading } = useQuery({
    queryKey: ["admin", "specialties", "stats"],
    queryFn: async () => {
      const { data } = await adminApi.getSpecialties();
      return data;
    },
  });

  if (usersLoading || apptLoading || specLoading) return <LoadingSpinner />;

  const stats = [
    {
      label: "Total Users",
      value: usersData?.pagination?.total || 0,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Total Appointments",
      value: appointmentsData?.pagination?.total || 0,
      icon: Calendar,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Specialties",
      value: specialtiesData?.data?.length || 0,
      icon: Stethoscope,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div>
      <PageTitle
        title="Admin Dashboard"
        description="System overview and management"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="border rounded-lg p-6 bg-card">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
