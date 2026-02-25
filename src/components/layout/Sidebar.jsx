import { NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  User,
  Calendar,
  CalendarPlus,
  Users,
  ShieldCheck,
  ClipboardList,
  Stethoscope,
} from "lucide-react";

const navItems = {
  patient: [
    { to: "/patient", icon: LayoutDashboard, label: "Dashboard", end: true },
    { to: "/patient/profile", icon: User, label: "My Profile" },
    { to: "/patient/appointments", icon: Calendar, label: "My Appointments" },
    { to: "/patient/book", icon: CalendarPlus, label: "Book Appointment" },
  ],
  doctor: [
    { to: "/doctor", icon: LayoutDashboard, label: "Dashboard", end: true },
    { to: "/doctor/profile", icon: User, label: "My Profile" },
    { to: "/doctor/appointments", icon: Calendar, label: "Appointments" },
  ],
  admin: [
    { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
    { to: "/admin/users", icon: Users, label: "Users" },
    { to: "/admin/doctors", icon: ShieldCheck, label: "Doctor Approvals" },
    { to: "/admin/appointments", icon: ClipboardList, label: "Appointments" },
    { to: "/admin/specialties", icon: Stethoscope, label: "Specialties" },
  ],
};

export default function Sidebar({ onItemClick }) {
  const { role } = useAuth();
  const items = navItems[role] || [];

  return (
    <nav className="p-3 space-y-1">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onItemClick}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )
          }
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
