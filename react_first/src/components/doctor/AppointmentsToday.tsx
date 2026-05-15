import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, Video, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Appointment } from '@/types/api';

interface AppointmentsTodayProps {
  appointments: Appointment[];
  isLoading: boolean;
}

export default function AppointmentsToday({ appointments, isLoading }: AppointmentsTodayProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      case 'no_show': return 'bg-slate-400';
      default: return 'bg-slate-400';
    }
  };

  const getTypeIcon = (type: string) => {
    if (type === 'video') return <Video className="h-3 w-3 text-blue-500" />;
    return <Clock className="h-3 w-3 text-slate-400" />;
  };

  if (isLoading) {
    return (
      <Card className="rounded-2xl border-slate-100 shadow-sm">
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-[150px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 items-center">
                <Skeleton className="h-4 w-12" />
                <div className="flex-1 flex items-center gap-3 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-3 w-[60px]" />
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
    <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-4 bg-slate-50/30">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-green-600 rounded-lg text-white">
            <Calendar className="h-4 w-4" />
          </div>
          <CardTitle className="text-lg font-black text-slate-900 tracking-tight">
            {t('doctorDashboard.appointments.title')}
          </CardTitle>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/doctor-dashboard/appointments')}
          className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600"
        >
          {t('doctorDashboard.appointments.viewAll')}
        </Button>
      </CardHeader>
      <CardContent className="flex-1 p-6">
        {appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 opacity-20" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest">{t('doctorDashboard.appointments.empty')}</p>
          </div>
        ) : (
          <div className="space-y-6 relative before:absolute before:inset-0 before:left-2 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-100">
            {appointments.map((appt) => (
              <div key={appt.id} className="relative flex items-center gap-4 group">
                {/* Timeline dot */}
                <div className={cn(
                  "flex items-center justify-center w-4 h-4 rounded-full border-4 border-white shadow-sm z-10 shrink-0",
                  getStatusColor(appt.status)
                )} />
                
                {/* Time */}
                <div className="text-[10px] font-black text-slate-900 w-10 shrink-0">
                  {appt.appointment_time?.substring(0, 5) || '--:--'}
                </div>

                {/* Card */}
                <div className="flex-1 bg-white border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] rounded-2xl p-3 flex items-center gap-3 transition-all hover:shadow-md hover:border-blue-100 cursor-pointer">
                  <Avatar className="h-9 w-9 border-2 border-slate-50 shadow-sm">
                    <AvatarFallback className="bg-slate-100 text-slate-600 font-bold text-xs">
                      {appt.patient_name?.charAt(0) || 'P'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{appt.patient_name || 'Anonymous'}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {getTypeIcon(appt.appointment_type)}
                      <p className="text-[10px] font-medium text-slate-500 uppercase tracking-tight truncate">
                        {appt.appointment_type?.replace('_', ' ') || 'Consultation'}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-3 w-3 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
