import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { getProfilePicUrl, formatTime } from "@/lib/utils";
import { Calendar, Clock, CheckCircle, FileText, User } from "lucide-react";

export default function StepConfirm({
  selectedDoctor,
  selectedDate,
  selectedSlot,
  slotDuration,
  notes,
  onNotesChange,
  onBook,
  isPending,
}) {
  return (
    <div className="max-w-lg">
      <div className="border rounded-xl p-6 bg-card">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold">Confirm Booking</h3>
        </div>

        <div className="space-y-4 text-sm">
          {/* Doctor */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
              {selectedDoctor.profilePicture ? (
                <img
                  src={getProfilePicUrl(selectedDoctor.profilePicture)}
                  alt={selectedDoctor.user?.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <User className="h-5 w-5 text-white/80" />
                </div>
              )}
            </div>
            <div>
              <p className="font-medium">{selectedDoctor.user?.name}</p>
              <p className="text-xs text-muted-foreground">
                {selectedDoctor.specialty?.name}
              </p>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Date
              </p>
              <p className="font-medium">
                {new Date(selectedDate).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <Clock className="h-3 w-3" /> Time
              </p>
              <p className="font-medium">
                {formatTime(selectedSlot.startTime)} -{" "}
                {formatTime(selectedSlot.endTime)}
              </p>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            Duration: {slotDuration} minutes
          </div>

          {/* Notes */}
          <div>
            <label
              htmlFor="booking-notes"
              className="block text-sm font-medium mb-2 flex items-center gap-1.5"
            >
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
              Notes{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </label>
            <textarea
              id="booking-notes"
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Any symptoms, allergies, or information for the doctor..."
              rows={3}
              className="w-full border rounded-lg px-3 py-2.5 text-sm bg-background resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onBook}
          disabled={isPending}
          className="w-full mt-6 bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2 transition-all duration-200 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/25"
        >
          {isPending ? (
            <>
              <LoadingSpinner size="sm" />
              Booking...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4" />
              Confirm Booking
            </>
          )}
        </button>
      </div>
    </div>
  );
}
