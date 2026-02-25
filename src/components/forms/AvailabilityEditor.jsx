import { Plus, Trash2 } from "lucide-react";
import { DAYS_OF_WEEK } from "@/lib/constants";

export default function AvailabilityEditor({ availability, onChange }) {
  const addDay = () => {
    const usedDays = availability.map((a) => a.day);
    const availableDay = DAYS_OF_WEEK.find((d) => !usedDays.includes(d));
    if (availableDay) {
      onChange([
        ...availability,
        {
          day: availableDay,
          slots: [{ startTime: "09:00", endTime: "17:00" }],
        },
      ]);
    }
  };

  const removeDay = (index) => {
    onChange(availability.filter((_, i) => i !== index));
  };

  const updateDay = (index, day) => {
    const updated = [...availability];
    updated[index] = { ...updated[index], day };
    onChange(updated);
  };

  const addSlot = (dayIndex) => {
    const updated = [...availability];
    updated[dayIndex] = {
      ...updated[dayIndex],
      slots: [
        ...updated[dayIndex].slots,
        { startTime: "09:00", endTime: "17:00" },
      ],
    };
    onChange(updated);
  };

  const removeSlot = (dayIndex, slotIndex) => {
    const updated = [...availability];
    updated[dayIndex] = {
      ...updated[dayIndex],
      slots: updated[dayIndex].slots.filter((_, i) => i !== slotIndex),
    };
    if (updated[dayIndex].slots.length === 0) {
      onChange(updated.filter((_, i) => i !== dayIndex));
    } else {
      onChange(updated);
    }
  };

  const updateSlot = (dayIndex, slotIndex, field, value) => {
    const updated = [...availability];
    updated[dayIndex] = {
      ...updated[dayIndex],
      slots: updated[dayIndex].slots.map((slot, i) =>
        i === slotIndex ? { ...slot, [field]: value } : slot,
      ),
    };
    onChange(updated);
  };

  const usedDays = availability.map((a) => a.day);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Weekly Availability</h3>
        {usedDays.length < 7 && (
          <button
            type="button"
            onClick={addDay}
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            <Plus className="h-4 w-4" />
            Add Day
          </button>
        )}
      </div>

      {availability.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No availability set. Click "Add Day" to start.
        </p>
      )}

      {availability.map((daySchedule, dayIndex) => (
        <div key={dayIndex} className="border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <select
              value={daySchedule.day}
              onChange={(e) => updateDay(dayIndex, e.target.value)}
              className="border rounded-md px-3 py-1.5 text-sm bg-background"
            >
              {DAYS_OF_WEEK.filter(
                (d) => d === daySchedule.day || !usedDays.includes(d),
              ).map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => removeDay(dayIndex)}
              className="text-destructive hover:text-destructive/80"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          {daySchedule.slots.map((slot, slotIndex) => (
            <div key={slotIndex} className="flex items-center gap-2">
              <input
                type="time"
                value={slot.startTime}
                onChange={(e) =>
                  updateSlot(dayIndex, slotIndex, "startTime", e.target.value)
                }
                className="border rounded-md px-3 py-1.5 text-sm bg-background"
              />
              <span className="text-muted-foreground">to</span>
              <input
                type="time"
                value={slot.endTime}
                onChange={(e) =>
                  updateSlot(dayIndex, slotIndex, "endTime", e.target.value)
                }
                className="border rounded-md px-3 py-1.5 text-sm bg-background"
              />
              <button
                type="button"
                onClick={() => removeSlot(dayIndex, slotIndex)}
                className="text-destructive hover:text-destructive/80"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => addSlot(dayIndex)}
            className="text-xs text-primary hover:underline"
          >
            + Add time slot
          </button>
        </div>
      ))}
    </div>
  );
}
