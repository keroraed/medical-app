import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";
import { getProfilePicUrl } from "@/lib/utils";
import { Calendar, ArrowRight } from "lucide-react";

export default function StepBrowse({
  specialties,
  specialty,
  onSpecialtyChange,
  doctors,
  doctorsLoading,
  onSelectDoctor,
}) {
  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={specialty}
          onChange={(e) => onSpecialtyChange(e.target.value)}
          className="border rounded-lg px-4 py-2.5 text-sm bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          aria-label="Filter by specialty"
        >
          <option value="">All Specialties</option>
          {specialties?.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {doctorsLoading ? (
        <LoadingSpinner />
      ) : doctors.length === 0 ? (
        <EmptyState
          title="No doctors found"
          description="Try a different specialty filter."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map((doc) => {
            const picUrl = getProfilePicUrl(doc.profilePicture);
            const initials =
              doc.user?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase() || "DR";

            return (
              <button
                key={doc._id}
                type="button"
                className="group border rounded-xl p-5 bg-card hover:shadow-lg hover:shadow-gray-200/50 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer text-left"
                onClick={() => onSelectDoctor(doc)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-xl overflow-hidden shadow-sm shrink-0">
                    {picUrl ? (
                      <img
                        src={picUrl}
                        alt={doc.user?.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs">
                        {initials}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm group-hover:text-primary transition-colors truncate">
                      {doc.user?.name}
                    </h3>
                    <p className="text-xs text-primary font-medium">
                      {doc.specialty?.name || "General"}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                  {doc.bio || "No bio available"}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {doc.availability?.length || 0} days available
                  </span>
                  <span className="text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                    Select <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
