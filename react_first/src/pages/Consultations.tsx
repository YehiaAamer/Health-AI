import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Video, CalendarDays, Clock3, Stethoscope } from "lucide-react";
import Header from "@/components/Shared/Header";
import Footer from "@/components/Shared/Footer";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

type AppointmentStatus = "upcoming" | "joinable" | "cancelled";

type Appointment = {
  id: number;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  image: string;
  status?: AppointmentStatus;
};

const doctorBySpecialty: Record<
  string,
  { doctor: string; specialty: string }
> = {
  general: {
    doctor: "Dr. Emily Carter",
    specialty: "General Practitioner",
  },
  cardio: {
    doctor: "Dr. David Lee",
    specialty: "Cardiologist",
  },
  derma: {
    doctor: "Dr. Sophia Rodriguez",
    specialty: "Dermatologist",
  },
  neuro: {
    doctor: "Dr. Michael Adams",
    specialty: "Neurologist",
  },
};

const formatDateLocal = (selectedDate: Date) => {
  const year = selectedDate.getFullYear();
  const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
  const day = String(selectedDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const Consultations = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [specialty, setSpecialty] = useState("");
  const [timeSlot, setTimeSlot] = useState("");

  const [reschedulingId, setReschedulingId] = useState<number | null>(null);
  const [newRescheduleDate, setNewRescheduleDate] = useState("");
  const [newRescheduleTime, setNewRescheduleTime] = useState("");

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 1,
      doctor: "Dr. Emily Carter",
      specialty: "General Practitioner",
      date: "2026-03-25",
      time: "14:00",
      image: "/placeholder.svg",
    },
    {
      id: 2,
      doctor: "Dr. David Lee",
      specialty: "Cardiologist",
      date: "2026-03-21",
      time: "10:00",
      image: "/placeholder.svg",
    },
    {
      id: 3,
      doctor: "Dr. Sophia Rodriguez",
      specialty: "Dermatologist",
      date: "2026-03-22",
      time: "16:30",
      image: "/placeholder.svg",
    },
  ]);

  const handleBooking = () => {
    if (!date || !specialty || !timeSlot) {
      toast.error(t("consultationsPage.selectRequired"));
      return;
    }

    const selectedDoctor = doctorBySpecialty[specialty];

    if (!selectedDoctor) {
      toast.error(t("consultationsPage.selectValidSpecialization"));
      return;
    }

    const formattedDate = formatDateLocal(date);

    const isAlreadyBooked = appointments.some(
      (appointment) =>
        appointment.status !== "cancelled" &&
        appointment.date === formattedDate &&
        appointment.time === timeSlot &&
        appointment.specialty === selectedDoctor.specialty,
    );

    if (isAlreadyBooked) {
      toast.error(t("consultationsPage.slotBooked"));
      return;
    }

    const newAppointment: Appointment = {
      id: Date.now(),
      doctor: selectedDoctor.doctor,
      specialty: selectedDoctor.specialty,
      date: formattedDate,
      time: timeSlot,
      image: "/placeholder.svg",
    };

    setAppointments((prevAppointments) => [newAppointment, ...prevAppointments]);

    toast.success(t("consultationsPage.confirmed"));

    setSpecialty("");
    setTimeSlot("");
    setDate(new Date());
  };

  const handleJoinCall = (appointmentId: number) => {
    const appointment = appointments.find((item) => item.id === appointmentId);
    if (!appointment) return;

    toast.success(
      isArabic
        ? `جارٍ الانضمام إلى استشارة ${appointment.doctor}...`
        : `Joining ${appointment.doctor}'s consultation...`,
    );
  };

  const handleReschedule = (appointmentId: number) => {
    const appointment = appointments.find((item) => item.id === appointmentId);
    if (!appointment) return;

    setReschedulingId(appointmentId);
    setNewRescheduleDate(appointment.date);
    setNewRescheduleTime(appointment.time);
  };

  const handleSaveReschedule = () => {
    if (!reschedulingId || !newRescheduleDate || !newRescheduleTime) {
      toast.error(t("consultationsPage.selectNewDateTime"));
      return;
    }

    const currentAppointment = appointments.find(
      (item) => item.id === reschedulingId,
    );

    if (!currentAppointment) return;

    const isAlreadyBooked = appointments.some(
      (item) =>
        item.id !== reschedulingId &&
        item.status !== "cancelled" &&
        item.date === newRescheduleDate &&
        item.time === newRescheduleTime &&
        item.specialty === currentAppointment.specialty,
    );

    if (isAlreadyBooked) {
      toast.error(t("consultationsPage.newSlotBooked"));
      return;
    }

    setAppointments((prevAppointments) =>
      prevAppointments.map((item) =>
        item.id === reschedulingId
          ? {
              ...item,
              date: newRescheduleDate,
              time: newRescheduleTime,
              status: undefined,
            }
          : item,
      ),
    );

    toast.success(
      isArabic
        ? `تمت إعادة جدولة موعد ${currentAppointment.doctor} بنجاح`
        : `Appointment with ${currentAppointment.doctor} rescheduled successfully`,
    );

    setReschedulingId(null);
    setNewRescheduleDate("");
    setNewRescheduleTime("");
  };

  const handleCloseReschedule = () => {
    setReschedulingId(null);
    setNewRescheduleDate("");
    setNewRescheduleTime("");
  };

  const handleCancel = (appointmentId: number) => {
    const appointment = appointments.find((item) => item.id === appointmentId);
    if (!appointment) return;

    setAppointments((prevAppointments) =>
      prevAppointments.map((item) =>
        item.id === appointmentId ? { ...item, status: "cancelled" } : item,
      ),
    );

    if (reschedulingId === appointmentId) {
      handleCloseReschedule();
    }

    toast.error(
      isArabic
        ? `تم إلغاء موعد ${appointment.doctor}`
        : `${appointment.doctor}'s appointment cancelled`,
    );
  };

  const formatAppointmentDateTime = (
    appointmentDate: string,
    appointmentTime: string,
  ) => {
    const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`);

    return appointmentDateTime.toLocaleString(isArabic ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getAppointmentStatus = (appointment: Appointment): AppointmentStatus => {
    if (appointment.status === "cancelled") {
      return "cancelled";
    }

    const now = new Date();
    const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`);

    if (now >= appointmentDateTime) {
      return "joinable";
    }

    return "upcoming";
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-background"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <Header variant="dashboard" />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t("consultationsPage.title")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("consultationsPage.subtitle")}
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="w-full max-w-md bg-gradient-to-br from-primary/10 to-cyan-600/10 rounded-2xl p-8">
            <div className="bg-accent/50 rounded-lg p-8 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Stethoscope className="w-10 h-10 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {t("consultationsPage.illustrationText")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Card className="p-8 mb-12 max-w-6xl mx-auto">
          <h2
            className={`text-2xl font-bold mb-6 flex items-center gap-2 ${
              isArabic ? "justify-end" : ""
            }`}
          >
            <CalendarDays className="w-6 h-6 text-primary" />
            {t("consultationsPage.bookingSection")}
          </h2>

          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </div>

            <div className="space-y-6">
              <div>
                <label
                  className={`flex items-center gap-2 text-sm font-medium mb-2 ${
                    isArabic ? "justify-end" : ""
                  }`}
                >
                  <Stethoscope className="w-4 h-4 text-primary" />
                  {t("consultationsPage.specialization")}
                </label>
                <Select value={specialty} onValueChange={setSpecialty}>
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue
                      placeholder={t("consultationsPage.generalPractitioner")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">
                      {t("consultationsPage.generalPractitioner")}
                    </SelectItem>
                    <SelectItem value="cardio">
                      {t("consultationsPage.cardiologist")}
                    </SelectItem>
                    <SelectItem value="derma">
                      {t("consultationsPage.dermatologist")}
                    </SelectItem>
                    <SelectItem value="neuro">
                      {t("consultationsPage.neurologist")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label
                  className={`flex items-center gap-2 text-sm font-medium mb-2 ${
                    isArabic ? "justify-end" : ""
                  }`}
                >
                  <Clock3 className="w-4 h-4 text-primary" />
                  {t("consultationsPage.timeSlots")}
                </label>
                <Select value={timeSlot} onValueChange={setTimeSlot}>
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue placeholder={t("consultationsPage.time1000")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10:00">
                      {t("consultationsPage.time1000")}
                    </SelectItem>
                    <SelectItem value="11:00">
                      {t("consultationsPage.time1100")}
                    </SelectItem>
                    <SelectItem value="14:00">
                      {t("consultationsPage.time1400")}
                    </SelectItem>
                    <SelectItem value="15:00">
                      {t("consultationsPage.time1500")}
                    </SelectItem>
                    <SelectItem value="16:00">
                      {t("consultationsPage.time1600")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleBooking} className="w-full" size="lg">
                {t("consultationsPage.confirm")}
              </Button>
            </div>
          </div>
        </Card>

        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">
            {t("consultationsPage.upcoming")}
          </h2>

          <div className="space-y-4">
            {[...appointments]
              .sort((a, b) => {
                const dateA = new Date(`${a.date}T${a.time}`);
                const dateB = new Date(`${b.date}T${b.time}`);
                return dateA.getTime() - dateB.getTime();
              })
              .map((appointment) => {
                const status = getAppointmentStatus(appointment);

                return (
                  <Card key={appointment.id} className="p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      <div
                        className={`flex items-center gap-4 ${
                          isArabic ? "md:flex-row-reverse text-right" : ""
                        }`}
                      >
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-cyan-600 rounded-full flex-shrink-0" />
                        <div>
                          <h3 className="font-bold">{appointment.doctor}</h3>
                          <p className="text-sm text-muted-foreground">
                            {appointment.specialty}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {formatAppointmentDateTime(
                              appointment.date,
                              appointment.time,
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-wrap">
                        {status === "joinable" && (
                          <Button
                            className="gap-2"
                            onClick={() => handleJoinCall(appointment.id)}
                          >
                            <Video className="h-4 w-4" />
                            {t("consultationsPage.joinCall")}
                          </Button>
                        )}

                        {status === "upcoming" && (
                          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
                            <span className="w-2 h-2 rounded-full bg-primary" />
                            {t("consultationsPage.upcomingStatus")}
                          </div>
                        )}

                        {status === "cancelled" && (
                          <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600">
                            <span className="w-2 h-2 rounded-full bg-red-500" />
                            {t("consultationsPage.cancelledStatus")}
                          </div>
                        )}

                        {status !== "cancelled" && (
                          <>
                            <Button
                              variant="ghost"
                              className="cursor-pointer hover:bg-primary/10 hover:text-primary transition"
                              onClick={() => handleReschedule(appointment.id)}
                            >
                              {t("consultationsPage.reschedule")}
                            </Button>

                            <Button
                              variant="ghost"
                              className="cursor-pointer hover:bg-primary/10 hover:text-primary transition"
                              onClick={() => handleCancel(appointment.id)}
                            >
                              {t("consultationsPage.cancel")}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    {reschedulingId === appointment.id &&
                      status !== "cancelled" && (
                        <div className="mt-6 border-t pt-6">
                          <h4 className="font-semibold mb-4">
                            {t("consultationsPage.rescheduleTitle")}
                          </h4>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                {t("consultationsPage.newDate")}
                              </label>
                              <input
                                type="date"
                                value={newRescheduleDate}
                                onChange={(e) =>
                                  setNewRescheduleDate(e.target.value)
                                }
                                className="w-full cursor-pointer rounded-md border border-input bg-background px-3 py-2 text-sm hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-2">
                                {t("consultationsPage.newTime")}
                              </label>
                              <Select
                                value={newRescheduleTime}
                                onValueChange={setNewRescheduleTime}
                              >
                                <SelectTrigger className="cursor-pointer hover:border-primary transition">
                                  <SelectValue
                                    placeholder={t(
                                      "consultationsPage.selectNewTime",
                                    )}
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="10:00">
                                    {t("consultationsPage.time1000")}
                                  </SelectItem>
                                  <SelectItem value="11:00">
                                    {t("consultationsPage.time1100")}
                                  </SelectItem>
                                  <SelectItem value="14:00">
                                    {t("consultationsPage.time1400")}
                                  </SelectItem>
                                  <SelectItem value="15:00">
                                    {t("consultationsPage.time1500")}
                                  </SelectItem>
                                  <SelectItem value="16:00">
                                    {t("consultationsPage.time1600")}
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="flex gap-3 mt-4">
                            <Button
                              onClick={handleSaveReschedule}
                              className="cursor-pointer hover:scale-105 transition-transform"
                            >
                              {t("consultationsPage.save")}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={handleCloseReschedule}
                              className="cursor-pointer hover:border-primary hover:text-primary transition"
                            >
                              {t("consultationsPage.cancel")}
                            </Button>
                          </div>
                        </div>
                      )}
                  </Card>
                );
              })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Consultations;