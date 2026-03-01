import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useDoctors,
  useDoctorDetail,
  useDoctorAvailability,
} from "@/hooks/queries/useDoctors";
import { useAvailableSlots } from "@/hooks/queries/useAppointments";
import { useSpecialties } from "@/hooks/queries/useSpecialties";
import { useBookAppointment } from "@/hooks/mutations/useBookAppointment";
import PageTitle from "@/components/shared/PageTitle";
import StepBrowse from "./book/StepBrowse";
import StepDoctor from "./book/StepDoctor";
import StepConfirm from "./book/StepConfirm";
import { ArrowLeft } from "lucide-react";

const STEPS = {
  BROWSE: 0,
  DETAIL: 1,
  CONFIRM: 2,
};

const STEP_LABELS = ["Browse", "Doctor & Slot", "Confirm"];

export default function BookAppointment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedDoctorId = searchParams.get("doctor");

  const [step, setStep] = useState(STEPS.BROWSE);
  const [specialty, setSpecialty] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [notes, setNotes] = useState("");

  const { data: specialties } = useSpecialties();
  const { data: doctorsData, isLoading: doctorsLoading } = useDoctors({
    page: 1,
    limit: 50,
    ...(specialty && { specialty }),
  });
  const { data: preselectedDoctor } = useDoctorDetail(preselectedDoctorId);
  const { data: availability } = useDoctorAvailability(selectedDoctor?._id);

  const {
    data: slotsData,
    isLoading: slotsLoading,
    isError: slotsError,
  } = useAvailableSlots(selectedDoctor?._id, selectedDate);

  // Auto-select doctor if coming from DoctorDetail page
  useEffect(() => {
    if (preselectedDoctor && !selectedDoctor) {
      setSelectedDoctor(preselectedDoctor);
      setStep(STEPS.DETAIL);
    }
  }, [preselectedDoctor, selectedDoctor]);

  const bookMutation = useBookAppointment();
  const doctors = doctorsData?.data || [];
  const availableSlots = slotsData?.slots || [];
  const availableCount = slotsData?.availableCount ?? 0;
  const slotDuration = slotsData?.slotDuration ?? 30;

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedDate("");
    setSelectedSlot(null);
    setNotes("");
    setStep(STEPS.DETAIL);
  };

  const handleSelectSlot = (slot) => {
    if (!slot.available) return;
    setSelectedSlot(slot);
    setStep(STEPS.CONFIRM);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleBook = () => {
    bookMutation.mutate(
      {
        doctor: selectedDoctor._id,
        date: selectedDate,
        startTime: selectedSlot.startTime,
        ...(notes.trim() && { notes: notes.trim() }),
      },
      {
        onSuccess: () => navigate("/patient/appointments"),
      },
    );
  };

  const goBack = () => {
    if (step === STEPS.CONFIRM) {
      setSelectedSlot(null);
      setStep(STEPS.DETAIL);
    } else if (step === STEPS.DETAIL) {
      setSelectedDoctor(null);
      setSelectedDate("");
      setSelectedSlot(null);
      setNotes("");
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
      <div className="flex items-center gap-1 sm:gap-2 mb-8">
        {STEP_LABELS.map((label, i) => (
          <div key={label} className="flex items-center gap-1 sm:gap-2">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs sm:text-sm transition-all duration-300 ${
                i < step
                  ? "bg-green-100 text-green-700"
                  : i === step
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              <span
                className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
                  i < step
                    ? "bg-green-600 text-white"
                    : i === step
                      ? "bg-white/20 text-inherit"
                      : "bg-gray-300 text-white"
                }`}
              >
                {i < step ? "✓" : i + 1}
              </span>
              <span className="hidden sm:inline font-medium">{label}</span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div
                className={`w-4 sm:w-8 h-0.5 rounded transition-colors ${
                  i < step ? "bg-green-400" : "bg-border"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {step > STEPS.BROWSE && (
        <button
          onClick={goBack}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      )}

      {step === STEPS.BROWSE && (
        <StepBrowse
          specialties={specialties}
          specialty={specialty}
          onSpecialtyChange={setSpecialty}
          doctors={doctors}
          doctorsLoading={doctorsLoading}
          onSelectDoctor={handleSelectDoctor}
        />
      )}

      {step === STEPS.DETAIL && selectedDoctor && (
        <StepDoctor
          selectedDoctor={selectedDoctor}
          availability={availability}
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          slotsData={slotsData}
          slotsLoading={slotsLoading}
          slotsError={slotsError}
          availableSlots={availableSlots}
          availableCount={availableCount}
          slotDuration={slotDuration}
          onSelectSlot={handleSelectSlot}
        />
      )}

      {step === STEPS.CONFIRM && selectedDoctor && selectedSlot && (
        <StepConfirm
          selectedDoctor={selectedDoctor}
          selectedDate={selectedDate}
          selectedSlot={selectedSlot}
          slotDuration={slotDuration}
          notes={notes}
          onNotesChange={setNotes}
          onBook={handleBook}
          isPending={bookMutation.isPending}
        />
      )}
    </div>
  );
}
