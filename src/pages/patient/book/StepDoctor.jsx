import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { getProfilePicUrl, formatTime } from "@/lib/utils";
import { Calendar, Clock, AlertCircle, User, Stethoscope } from "lucide-react";

export default function StepDoctor({
  selectedDoctor,
  availability,
  selectedDate,
  onDateChange,
  slotsData,
  slotsLoading,
  slotsError,
  availableSlots,
  availableCount,
  slotDuration,
  onSelectSlot,
}) {
  return (
    <div className="space-y-5">
      {/* Doctor card */}
      <div className="border rounded-xl p-6 bg-card">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl overflow-hidden shadow-md shrink-0">
            {selectedDoctor.profilePicture ? (
              <img
                src={getProfilePicUrl(selectedDoctor.profilePicture)}
                alt={selectedDoctor.user?.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <User className="h-7 w-7 text-white/80" />
              </div>
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold">{selectedDoctor.user?.name}</h3>
            <p className="text-primary font-medium text-sm flex items-center gap-1.5 mt-0.5">
              <Stethoscope className="h-3.5 w-3.5" />
              {selectedDoctor.specialty?.name}
            </p>
          </div>
        </div>
        {selectedDoctor.bio && (
          <p className="text-muted-foreground text-sm">{selectedDoctor.bio}</p>
        )}

        {availability && availability.length > 0 && (
          <div className="mt-5 pt-4 border-t">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Weekly Schedule
            </h4>
            <div className="flex flex-wrap gap-2">
              {availability.map((day) => (
                <span
                  key={day.day}
                  className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium"
                >
                  {day.day}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Date picker */}
      <div className="border rounded-xl p-6 bg-card">
        <label
          htmlFor="appt-date"
          className="block text-sm font-semibold mb-3 flex items-center gap-2"
        >
          <Calendar className="h-4 w-4 text-primary" />
          Select Date
        </label>
        <input
          id="appt-date"
          type="date"
          value={selectedDate}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => onDateChange(e.target.value)}
          className="border rounded-lg px-4 py-2.5 text-sm bg-background w-full sm:w-auto focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
        />
      </div>

      {/* Slots */}
      {selectedDate && (
        <div className="border rounded-xl p-6 bg-card">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Available Slots
              {slotsData && (
                <span className="text-xs font-normal text-muted-foreground">
                  — {slotsData.day}, {slotDuration} min each
                </span>
              )}
            </h4>
            {slotsData && (
              <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">
                {availableCount} available
              </span>
            )}
          </div>

          {slotsLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : slotsError ? (
            <div className="flex items-center gap-2 text-sm text-destructive py-4">
              <AlertCircle className="h-4 w-4" />
              Doctor is not available on this date. Please pick another date.
            </div>
          ) : availableSlots.length === 0 ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
              <AlertCircle className="h-4 w-4" />
              No slots available on this date.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {availableSlots.map((slot, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onSelectSlot(slot)}
                  disabled={!slot.available}
                  className={`relative px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    slot.available
                      ? "border border-gray-200 bg-white hover:border-primary hover:bg-primary/5 hover:text-primary hover:shadow-sm cursor-pointer"
                      : "border border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through"
                  }`}
                >
                  <span className="flex items-center justify-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                  </span>
                  {!slot.available && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-[9px] font-bold">
                      ✕
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
