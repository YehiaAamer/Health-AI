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
import { Video } from "lucide-react";
import Header from "@/components/Shared/Header";
import Footer from "@/components/Shared/Footer";
import { toast } from "sonner";

const Consultations = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [specialty, setSpecialty] = useState("");
  const [timeSlot, setTimeSlot] = useState("");

  const handleBooking = () => {
    if (!date || !specialty || !timeSlot) {
      toast.error("Please select all required fields");
      return;
    }
    toast.success("Appointment confirmed!");
  };

  const upcomingAppointments = [
    {
      id: 1,
      doctor: "Dr. Emily Carter",
      specialty: "General Practitioner",
      date: "July 15, 2024 | 2:00 PM",
      status: "confirmed",
      image: "/placeholder.svg",
    },
    {
      id: 2,
      doctor: "Dr. David Lee",
      specialty: "Cardiologist",
      date: "July 22, 2024 | 10:00 AM",
      status: "upcoming",
      image: "/placeholder.svg",
    },
    {
      id: 3,
      doctor: "Dr. Sophia Rodriguez",
      specialty: "Dermatologist",
      date: "August 5, 2024 | 4:30 PM",
      status: "upcoming",
      image: "/placeholder.svg",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header variant="dashboard" />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Book an Online Consultation
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with certified doctors for expert guidance after your AI
            health report.
          </p>
        </div>

        {/* Illustration */}
        <div className="flex justify-center mb-12">
          <div className="w-full max-w-md bg-gradient-to-br from-primary/10 to-cyan-600/10 rounded-2xl p-8">
            <div className="bg-accent/50 rounded-lg p-8 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-primary/20 rounded-full mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  Doctor consultation illustration
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Section */}
        <Card className="p-8 mb-12 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Booking Section</h2>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Calendar */}
            <div>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </div>

            {/* Booking Details */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Doctor Specialization
                </label>
                <Select value={specialty} onValueChange={setSpecialty}>
                  <SelectTrigger>
                    <SelectValue placeholder="General Practitioner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">
                      General Practitioner
                    </SelectItem>
                    <SelectItem value="cardio">Cardiologist</SelectItem>
                    <SelectItem value="derma">Dermatologist</SelectItem>
                    <SelectItem value="neuro">Neurologist</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Available Time Slots
                </label>
                <Select value={timeSlot} onValueChange={setTimeSlot}>
                  <SelectTrigger>
                    <SelectValue placeholder="10:00 AM" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10:00">10:00 AM</SelectItem>
                    <SelectItem value="11:00">11:00 AM</SelectItem>
                    <SelectItem value="14:00">2:00 PM</SelectItem>
                    <SelectItem value="15:00">3:00 PM</SelectItem>
                    <SelectItem value="16:00">4:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleBooking} className="w-full" size="lg">
                Confirm Appointment
              </Button>
            </div>
          </div>
        </Card>

        {/* Upcoming Appointments */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Upcoming Appointments</h2>
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <Card key={appointment.id} className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-cyan-600 rounded-full flex-shrink-0" />
                    <div>
                      <h3 className="font-bold">{appointment.doctor}</h3>
                      <p className="text-sm text-muted-foreground">
                        {appointment.specialty}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {appointment.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {appointment.status === "confirmed" ? (
                      <Button className="gap-2">
                        <Video className="h-4 w-4" />
                        Join Call
                      </Button>
                    ) : (
                      <Button variant="outline" className="gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full" />
                        Upcoming
                      </Button>
                    )}
                    <Button variant="ghost">Reschedule</Button>
                    <Button variant="ghost">Cancel</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Consultations;
