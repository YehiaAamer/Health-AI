import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useApiCall } from "@/hooks/useApiCall";
import { API_ENDPOINTS } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  User as UserIcon,
  Video,
  ExternalLink,
  MoreVertical,
  X,
  RefreshCw,
  LayoutGrid,
  List
} from "lucide-react";
import LoadingDots from "@/components/shared/LoadingDots";

interface Appointment {
  id: string | number;
  patient_name: string;
  patient_id: string;
  time: string;
  reason: string;
  status: 'Upcoming' | 'In Progress' | 'Completed' | 'Cancelled';
  profile_picture?: string;
}

export default function AppointmentsPage() {
  const { t, i18n } = useTranslation();
  const { execute: apiCall } = useApiCall();
  const isArabic = i18n.language === "ar";
  
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 4, 10)); // May 10, 2026
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Realistic Dummy Data
  const dummyAppointments: Appointment[] = [
    {
      id: 1,
      patient_name: isArabic ? "يوسف إبراهيم" : "Youssef Ibrahim",
      patient_id: "PID-2241",
      time: "10:00 AM - 10:30 AM",
      reason: isArabic ? "متابعة السكري" : "Diabetes Follow-up",
      status: 'In Progress',
    },
    {
      id: 2,
      patient_name: isArabic ? "مريم محمود" : "Mariam Mahmoud",
      patient_id: "PID-1152",
      time: "11:00 AM - 11:30 AM",
      reason: isArabic ? "مراجعة ضغط الدم" : "Blood Pressure Review",
      status: 'Upcoming',
    },
    {
      id: 3,
      patient_name: isArabic ? "عمر خالد" : "Omar Khaled",
      patient_id: "PID-3367",
      time: "12:00 PM - 12:30 PM",
      reason: isArabic ? "استشارة غذائية" : "Nutritional Consultation",
      status: 'Upcoming',
    },
    {
      id: 4,
      patient_name: isArabic ? "هناء سعيد" : "Hana Saeed",
      patient_id: "PID-4489",
      time: "02:00 PM - 02:30 PM",
      reason: isArabic ? "فحص سنوي" : "Annual Checkup",
      status: 'Completed',
    },
    {
      id: 5,
      patient_name: isArabic ? "كريم علي" : "Karim Ali",
      patient_id: "PID-5590",
      time: "03:00 PM - 03:30 PM",
      reason: isArabic ? "مراجعة نتائج التحاليل" : "Lab Results Review",
      status: 'Upcoming',
    }
  ];

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const data = await apiCall(API_ENDPOINTS.DOCTOR_APPOINTMENTS_TODAY);
        if (data && data.appointments && data.appointments.length > 0) {
          const mapped = data.appointments.map((apt: any) => ({
            ...apt,
            patient_id: apt.patient_id || `PID-${Math.floor(1000 + Math.random() * 9000)}`,
            status: apt.status === 'completed' ? 'Completed' : 'Upcoming'
          }));
          setAppointments(mapped);
        } else {
          setAppointments(dummyAppointments);
        }
      } catch (error) {
        console.error("Failed to fetch appointments", error);
        setAppointments(dummyAppointments);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [apiCall, isArabic]);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'In Progress':
        return "bg-orange-50 text-orange-600 border-orange-100";
      case 'Completed':
        return "bg-green-50 text-green-600 border-green-100";
      case 'Cancelled':
        return "bg-red-50 text-red-600 border-red-100";
      default:
        return "bg-blue-50 text-blue-600 border-blue-100";
    }
  };

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {t('doctorDashboard.appointments.title')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isArabic ? "عرض وإدارة جدول مواعيدك اليومية" : "View and manage your daily appointment schedule"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder={t('doctorDashboard.appointments.searchPlaceholder')}
              className="pl-10 h-11 bg-white border-slate-200 rounded-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button className="h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-lg shadow-slate-900/20 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{t('doctorDashboard.appointments.newAppointment')}</span>
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <Tabs defaultValue="today" className="w-fit">
          <TabsList className="bg-slate-100 p-1 rounded-xl h-11">
            <TabsTrigger value="today" className="rounded-lg px-6 font-bold">{t('doctorDashboard.appointments.filterToday')}</TabsTrigger>
            <TabsTrigger value="upcoming" className="rounded-lg px-6 font-bold">{t('doctorDashboard.appointments.filterUpcoming')}</TabsTrigger>
            <TabsTrigger value="all" className="rounded-lg px-6 font-bold">{t('doctorDashboard.appointments.filterAll')}</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl bg-white border-slate-200">
            <LayoutGrid className="h-5 w-5 text-slate-400" />
          </Button>
          <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl bg-slate-900 border-slate-900 text-white">
            <List className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left: Calendar */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 border-slate-100 shadow-xl shadow-slate-200/40 rounded-3xl bg-white">
            <div className="flex items-center gap-2 mb-4">
              <CalendarIcon className="h-5 w-5 text-blue-600" />
              <h3 className="font-bold text-slate-900">{isArabic ? "التقويم" : "Calendar"}</h3>
            </div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="w-full"
            />
          </Card>

          <Card className="p-6 border-slate-100 shadow-lg shadow-slate-200/30 rounded-3xl bg-blue-600 text-white overflow-hidden relative group">
            <div className="relative z-10">
              <h4 className="font-bold text-lg mb-2">{isArabic ? "موعد القادم" : "Next Appointment"}</h4>
              <p className="text-blue-100 text-sm mb-4">{isArabic ? "خلال 15 دقيقة" : "In 15 minutes"}</p>
              <div className="flex items-center gap-3 p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                  <UserIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-sm">{dummyAppointments[1].patient_name}</p>
                  <p className="text-xs text-blue-100">{dummyAppointments[1].time}</p>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 opacity-10 group-hover:scale-110 transition-transform">
              <Clock className="h-32 w-32" />
            </div>
          </Card>
        </div>

        {/* Right: Appointments List */}
        <div className="lg:col-span-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <LoadingDots />
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.length > 0 ? (
                appointments.map((apt) => (
                  <Card key={apt.id} className="p-5 border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 rounded-2xl bg-white group">
                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-14 w-14 border-2 border-white shadow-md ring-4 ring-slate-50">
                          <AvatarImage src={apt.profile_picture} />
                          <AvatarFallback className="bg-slate-50 text-slate-400">
                            <UserIcon className="h-6 w-6" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {apt.patient_name}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-slate-500 mt-0.5">
                            <span className="font-semibold text-slate-400">{apt.patient_id}</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {apt.time}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 max-w-sm hidden xl:block">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{isArabic ? "السبب / الحالة" : "Reason / Condition"}</p>
                        <p className="text-sm font-semibold text-slate-700">{apt.reason}</p>
                      </div>

                      <div className="flex items-center justify-between xl:justify-end gap-4">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getStatusStyles(apt.status)}`}>
                          {apt.status === 'In Progress' ? t('doctorDashboard.appointments.statusInProgress') :
                           apt.status === 'Completed' ? t('doctorDashboard.appointments.statusCompleted') : t('doctorDashboard.appointments.statusUpcoming')}
                        </span>

                        <div className="flex items-center gap-2">
                          {apt.status === 'In Progress' && (
                            <Button className="h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20 flex items-center gap-2">
                              <Video className="h-4 w-4" />
                              <span className="text-sm font-bold">{t('doctorDashboard.appointments.joinCall')}</span>
                            </Button>
                          )}
                          <Button variant="ghost" className="h-10 px-4 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl font-bold text-sm hidden sm:flex">
                            {t('doctorDashboard.appointments.viewProfile')}
                          </Button>
                          <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-slate-900 rounded-xl">
                            <MoreVertical className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                  <CalendarIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-900">{t('doctorDashboard.appointments.empty')}</h3>
                  <p className="text-slate-500">{isArabic ? "لم يتم العثور على مواعيد لهذا اليوم" : "No appointments found for this day"}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
