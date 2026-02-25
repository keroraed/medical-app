import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDoctors, useDoctorAvailability } from "@/hooks/queries/useDoctors";
import { useSpecialties } from "@/hooks/queries/useSpecialties";
import { useBookAppointment } from "@/hooks/mutations/useBookAppointment";
import PageTitle from "@/components/shared/PageTitle";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";
import { formatTime } from "@/lib/utils";
import { DAYS_OF_WEEK } from "@/lib/constants";
import { Search, Calendar, Clock, CheckCircle, ArrowLeft } from "lucide-react";

const STEPS = {
  BROWSE: 0,
  DETAIL: 1,
  SLOT: 2,
  CONFIRM: 3,
};

export default function BookAppointment() {
  const navigate = useNavigate();
  const [step, setStep] = useState(STEPS.BROWSE);
  const [specialty, setSpecialty] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);

  const { data: specialties } = useSpecialties();
  const { data: doctorsData, isLoading: doctorsLoading } = useDoctors({
    page: 1,
    limit: 50,
    ...(specialty && { specialty }),
  });
  const { data: availability } = useDoctorAvailability(selectedDoctor?._id);

  const bookMutation = useBookAppointment();

  const doctors = doctorsData?.data || [];

  // Get the day name for the selected date
  const selectedDayName = selectedDate
    ? DAYS_OF_WEEK[new Date(selectedDate).getDay()]
    : null;

  // Get slots for the selected day
  const dayAvailability = availability?.find((a) => a.day === selectedDayName);

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedDate("");
    setSelectedSlot(null);
    setStep(STEPS.DETAIL);
  };

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot);
    setStep(STEPS.CONFIRM);
  };

  const handleBook = () => {
    bookMutation.mutate(
      {
        doctor: selectedDoctor._id,
        date: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
      },
      {
        onSuccess: () => {
          navigate("/patient/appointments");
        },
      },
    );
  };

  const goBack = () => {
    if (step === STEPS.CONFIRM) setStep(STEPS.SLOT);
    else if (step === STEPS.SLOT) setStep(STEPS.DETAIL);
    else if (step === STEPS.DETAIL) {
      setSelectedDoctor(null);
      setStep(STEPS.BROWSE);
    }
  };

  return (
    <div>
      <PageTitle
        title="Book Appointment"
        description="Find a doctor and book your appointment"
      />

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6 text-sm">
        {["Browse", "Doctor", "Time Slot", "Confirm"].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <span
              className={`flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                i <= step
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {i + 1}
            </span>
            <span
              className={i <= step ? "font-medium" : "text-muted-foreground"}
            >
              {label}
            </span>
            {i < 3 && <div className="w-8 h-px bg-border" />}
          </div>
        ))}
      </div>

      {step > STEPS.BROWSE && (
        <button
          onClick={goBack}
          className="flex items-center gap-1 text-sm text-primary hover:underline mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      )}

      {/* Step 1: Browse Doctors */}
      {step === STEPS.BROWSE && (
        <div>
          <div className="flex flex-wrap gap-3 mb-6">
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm bg-background"
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
              {doctors.map((doc) => (
                <div
                  key={doc._id}
                  className="border rounded-lg p-4 bg-card hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleSelectDoctor(doc)}
                >
                  <h3 className="font-semibold">{doc.user?.name}</h3>
                  <p className="text-sm text-primary">
                    {doc.specialty?.name || "General"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {doc.bio || "No bio available"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {doc.availability?.length || 0} days available
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 2: Doctor Detail */}
      {step === STEPS.DETAIL && selectedDoctor && (
        <div className="border rounded-lg p-6 bg-card">
          <h3 className="text-xl font-semibold">{selectedDoctor.user?.name}</h3>
          <p className="text-primary">{selectedDoctor.specialty?.name}</p>
          <p className="text-muted-foreground mt-2">{selectedDoctor.bio}</p>

          {availability && (
            <div className="mt-6">
              <h4 className="font-medium mb-3">Schedule</h4>
              <div className="grid gap-2">
                {availability.map((day) => (
                  <div key={day.day} className="text-sm">
                    <span className="font-medium w-24 inline-block">
                      {day.day}:
                    </span>
                    {day.slots.map((slot, i) => (
                      <span key={i} className="text-muted-foreground">
                        {formatTime(slot.startTime)} -{" "}
                        {formatTime(slot.endTime)}
                        {i < day.slots.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <label className="block text-sm font-medium mb-2">
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedSlot(null);
              }}
              className="border rounded-md px-3 py-2 text-sm bg-background"
            />
          </div>

          {selectedDate && dayAvailability && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">
                Available Slots for {selectedDayName}
              </h4>
              <div className="flex flex-wrap gap-2">
                {dayAvailability.slots.map((slot, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectSlot(slot)}
                    className="px-3 py-2 border rounded-md text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedDate && !dayAvailability && (
            <p className="mt-4 text-sm text-destructive">
              Doctor is not available on {selectedDayName}. Please pick another
              date.
            </p>
          )}
        </div>
      )}

      {/* Step 3 / Confirm */}
      {step === STEPS.CONFIRM && selectedDoctor && selectedSlot && (
        <div className="border rounded-lg p-6 bg-card max-w-md">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold">Confirm Booking</h3>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <span className="text-muted-foreground">Doctor:</span>{" "}
              <span className="font-medium">{selectedDoctor.user?.name}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Specialty:</span>{" "}
              <span className="font-medium">
                {selectedDoctor.specialty?.name}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Date:</span>{" "}
              <span className="font-medium">{selectedDate}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Time:</span>{" "}
              <span className="font-medium">
                {formatTime(selectedSlot.startTime)} -{" "}
                {formatTime(selectedSlot.endTime)}
              </span>
            </div>
          </div>

          <button
            onClick={handleBook}
            disabled={bookMutation.isPending}
            className="w-full mt-6 bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {bookMutation.isPending && (
              <Calendar className="h-4 w-4 animate-spin" />
            )}
            Confirm Booking
          </button>
        </div>
      )}
    </div>
  );
}
