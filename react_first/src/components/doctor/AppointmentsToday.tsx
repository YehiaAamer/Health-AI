import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, Video } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Patient {
  id: number;
  name: string;
  profile_picture?: string | null;
}

interface Appointment {
  id: number;
  patient: Patient;
  time: string; // "HH:MM" format
  status: string;
  type: string;
}

interface AppointmentsTodayProps {
  appointments: Appointment[];
  isLoading: boolean;
}

export default function AppointmentsToday({ appointments, isLoading }: AppointmentsTodayProps) {
  const { t } = useTranslation();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      case 'no_show': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    if (type === 'online' || type === 'video') return <Video className="h-3 w-3 text-blue-500" />;
    return <Clock className="h-3 w-3 text-muted-foreground" />;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            {t('doctorDashboard.appointments.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 items-center">
                <div className="flex flex-col items-center min-w-[50px]">
                  <Skeleton className="h-4 w-10 mb-1" />
                  <Skeleton className="h-3 w-8" />
                </div>
                <div className="flex-1 flex items-center gap-3 bg-muted/30 p-3 rounded-lg border">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[120px]" />
                    <Skeleton className="h-3 w-[80px]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          {t('doctorDashboard.appointments.title')}
        </CardTitle>
        <Button variant="ghost" size="sm" className="text-xs">
          {t('doctorDashboard.appointments.viewAll')}
        </Button>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground flex flex-col items-center">
            <Calendar className="h-8 w-8 mb-2 opacity-20" />
            <p>{t('doctorDashboard.appointments.empty')}</p>
          </div>
        ) : (
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-muted before:to-transparent">
            {appointments.map((appt) => (
              <div key={appt.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                {/* Timeline dot */}
                <div className={cn(
                  "flex items-center justify-center w-3 h-3 rounded-full border-2 border-background z-10",
                  getStatusColor(appt.status)
                )} />
                
                {/* Time */}
                <div className="w-[60px] text-sm font-medium ml-4 shrink-0">
                  {appt.time}
                </div>

                {/* Card */}
                <div className="flex-1 bg-card border shadow-sm rounded-lg p-3 flex items-center gap-3 transition-colors hover:bg-muted/50">
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarImage src={appt.patient.profile_picture || undefined} />
                    <AvatarFallback>{appt.patient.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium truncate">{appt.patient.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      {getTypeIcon(appt.type)}
                      <p className="text-xs text-muted-foreground truncate capitalize">
                        {appt.type.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
