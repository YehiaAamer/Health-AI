import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useApiCall } from "@/hooks/useApiCall";
import { API_ENDPOINTS } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import LoadingDots from "@/components/shared/LoadingDots";

export default function AppointmentsPage() {
  const { t } = useTranslation();
  const apiCall = useApiCall();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await apiCall(API_ENDPOINTS.DOCTOR_APPOINTMENTS_TODAY);
        setAppointments(data.appointments || []);
      } catch (error) {
        console.error("Failed to fetch appointments", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [apiCall]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('doctorDashboard.sidebar.appointments')}</h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <LoadingDots />
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.length > 0 ? (
            appointments.map((apt: any) => (
              <Card key={apt.id}>
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <CalendarIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{apt.patient_name}</h3>
                      <p className="text-sm text-muted-foreground">{apt.reason || 'Routine Checkup'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{apt.time}</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      apt.status === 'completed' ? 'bg-green-100 text-green-700' :
                      apt.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {apt.status}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="p-12 text-center text-muted-foreground">
              {t('doctorDashboard.noAppointments')}
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
