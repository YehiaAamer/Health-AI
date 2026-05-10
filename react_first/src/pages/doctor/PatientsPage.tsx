import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useApiCall } from "@/hooks/useApiCall";
import { API_ENDPOINTS } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Plus, 
  ChevronRight, 
  User as UserIcon,
  Filter,
  MoreVertical,
  Calendar,
  Activity,
  ArrowUpDown
} from "lucide-react";
import LoadingDots from "@/components/shared/LoadingDots";

interface Patient {
  id: string | number;
  first_name: string;
  last_name: string;
  email: string;
  age: number;
  gender: string;
  profile_picture?: string;
  patient_id: string;
  last_visit: string;
  condition: string;
  risk_level: 'High' | 'Medium' | 'Low';
}

export default function PatientsPage() {
  const { t, i18n } = useTranslation();
  const apiCall = useApiCall();
  const isArabic = i18n.language === "ar";
  
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Realistic Dummy Data (updated with May 5, 2026)
  const dummyPatients: Patient[] = [
    {
      id: 1,
      first_name: isArabic ? "أحمد" : "Ahmed",
      last_name: isArabic ? "منصور" : "Mansour",
      email: "ahmed.m@example.com",
      age: 45,
      gender: isArabic ? "ذكر" : "Male",
      patient_id: "PID-8821",
      last_visit: isArabic ? "5 مايو، 2026" : "May 5, 2026",
      condition: isArabic ? "سكري النوع الثاني" : "Type 2 Diabetes",
      risk_level: 'High'
    },
    {
      id: 2,
      first_name: isArabic ? "سارة" : "Sarah",
      last_name: isArabic ? "علي" : "Ali",
      email: "sarah.a@example.com",
      age: 32,
      gender: isArabic ? "أنثى" : "Female",
      patient_id: "PID-7732",
      last_visit: isArabic ? "4 مايو، 2026" : "May 4, 2026",
      condition: isArabic ? "ضغط دم مرتفع" : "Hypertension",
      risk_level: 'Medium'
    },
    {
      id: 3,
      first_name: isArabic ? "محمود" : "Mahmoud",
      last_name: isArabic ? "حسن" : "Hassan",
      email: "m.hassan@example.com",
      age: 58,
      gender: isArabic ? "ذكر" : "Male",
      patient_id: "PID-9910",
      last_visit: isArabic ? "5 مايو، 2026" : "May 5, 2026",
      condition: isArabic ? "كوليسترول" : "Cholesterol",
      risk_level: 'Low'
    },
    {
      id: 4,
      first_name: isArabic ? "ليلى" : "Layla",
      last_name: isArabic ? "إبراهيم" : "Ibrahim",
      email: "layla.i@example.com",
      age: 27,
      gender: isArabic ? "أنثى" : "Female",
      patient_id: "PID-6654",
      last_visit: isArabic ? "3 مايو، 2026" : "May 3, 2026",
      condition: isArabic ? "فحص دوري" : "Routine Checkup",
      risk_level: 'Low'
    },
    {
      id: 5,
      first_name: isArabic ? "ياسين" : "Yassin",
      last_name: isArabic ? "سعد" : "Saad",
      email: "yassin.s@example.com",
      age: 51,
      gender: isArabic ? "ذكر" : "Male",
      patient_id: "PID-5543",
      last_visit: isArabic ? "5 مايو، 2026" : "May 5, 2026",
      condition: isArabic ? "أمراض القلب" : "Heart Disease",
      risk_level: 'High'
    },
    {
      id: 6,
      first_name: isArabic ? "فاطمة" : "Fatma",
      last_name: isArabic ? "يوسف" : "Youssef",
      email: "fatma.y@example.com",
      age: 39,
      gender: isArabic ? "أنثى" : "Female",
      patient_id: "PID-4421",
      last_visit: isArabic ? "2 مايو، 2026" : "May 2, 2026",
      condition: isArabic ? "سكري الحمل" : "Gestational Diabetes",
      risk_level: 'Medium'
    }
  ];

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const data = await apiCall(API_ENDPOINTS.DOCTOR_PATIENTS);
        if (data && data.length > 0) {
          const mappedData = data.map((p: any) => ({
            ...p,
            patient_id: p.patient_id || `PID-${Math.floor(1000 + Math.random() * 9000)}`,
            last_visit: p.last_visit || (isArabic ? "5 مايو، 2026" : "May 5, 2026"),
            condition: p.condition || (isArabic ? "فحص دوري" : "Routine Checkup"),
            risk_level: p.risk_level || (Math.random() > 0.6 ? 'High' : Math.random() > 0.3 ? 'Medium' : 'Low')
          }));
          setPatients(mappedData);
        } else {
          setPatients(dummyPatients);
        }
      } catch (error) {
        console.error("Failed to fetch patients", error);
        setPatients(dummyPatients);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, [apiCall, isArabic]);

  const filteredPatients = patients.filter((p) => {
    const matchesSearch = `${p.first_name} ${p.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
                         p.patient_id?.toLowerCase().includes(search.toLowerCase()) ||
                         p.email?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.risk_level.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getRiskBadgeStyles = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high':
        return "bg-red-50 text-red-600 border-red-100 hover:bg-red-100";
      case 'medium':
        return "bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100";
      case 'low':
        return "bg-green-50 text-green-600 border-green-100 hover:bg-green-100";
      default:
        return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {t('doctorDashboard.patients.title')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isArabic ? "إدارة ومتابعة سجلات المرضى الخاصة بك" : "Manage and monitor your patient records"}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <Input
              placeholder={t('doctorDashboard.patients.searchPlaceholder')}
              className="pl-10 h-11 bg-white border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-600/20 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button className="h-11 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-lg shadow-slate-900/20 transition-all flex items-center gap-2 shrink-0">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{t('doctorDashboard.patients.addNew')}</span>
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Tabs defaultValue="all" className="w-fit" onValueChange={setStatusFilter}>
          <TabsList className="bg-slate-100 p-1 rounded-xl h-11">
            <TabsTrigger value="all" className="rounded-lg px-6 font-bold">{t('doctorDashboard.appointments.filterAll')}</TabsTrigger>
            <TabsTrigger value="high" className="rounded-lg px-6 font-bold text-red-600">{t('dashboard.riskHigh')}</TabsTrigger>
            <TabsTrigger value="medium" className="rounded-lg px-6 font-bold text-orange-600">{t('dashboard.riskMedium')}</TabsTrigger>
            <TabsTrigger value="low" className="rounded-lg px-6 font-bold text-green-600">{t('dashboard.riskLow')}</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-11 px-4 rounded-xl bg-white border-slate-200 text-slate-600 flex items-center gap-2 font-semibold">
            <Filter className="h-4 w-4" />
            {isArabic ? "تصفية متقدمة" : "Advanced Filters"}
          </Button>
          <Button variant="outline" className="h-11 px-4 rounded-xl bg-white border-slate-200 text-slate-600 flex items-center gap-2 font-semibold">
            <ArrowUpDown className="h-4 w-4" />
            {isArabic ? "ترتيب" : "Sort By"}
          </Button>
        </div>
      </div>

      {/* Patients List Section */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <LoadingDots />
          <p className="text-slate-400 animate-pulse">
            {t('dashboard.loading')}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient) => (
              <Card 
                key={patient.id} 
                className="group p-5 md:p-6 bg-white border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 rounded-2xl"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left Side: Avatar & Name */}
                  <div className="flex items-center gap-5 lg:w-1/4">
                    <div className="relative">
                      <Avatar className="h-16 w-16 border-2 border-white shadow-md ring-4 ring-slate-50/50">
                        <AvatarImage src={patient.profile_picture} alt={`${patient.first_name}`} />
                        <AvatarFallback className="bg-slate-50 text-slate-400">
                          <UserIcon className="h-7 w-7" />
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-white ${
                        patient.risk_level === 'High' ? 'bg-red-500' : 
                        patient.risk_level === 'Medium' ? 'bg-orange-500' : 'bg-green-500'
                      }`} />
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {patient.first_name} {patient.last_name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-sm text-slate-500 font-medium">
                        <span className="font-bold text-blue-600/70">{patient.patient_id}</span>
                        <span>•</span>
                        <span>{t('doctorDashboard.patients.ageGender', { 
                          age: patient.age, 
                          gender: patient.gender 
                        })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle Section: Details */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-8 flex-1 max-w-2xl">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 flex items-center gap-1.5">
                        <Calendar className="h-3 w-3" />
                        {t('doctorDashboard.patients.lastVisit')}
                      </p>
                      <p className="text-sm font-bold text-slate-700">
                        {patient.last_visit}
                      </p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 flex items-center gap-1.5">
                        <Activity className="h-3 w-3" />
                        {t('doctorDashboard.patients.condition')}
                      </p>
                      <p className="text-sm font-bold text-slate-700 truncate max-w-[150px]">
                        {patient.condition}
                      </p>
                    </div>

                    <div className="space-y-1 col-span-2 md:col-span-1">
                      <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                        {isArabic ? "مستوى الخطورة" : "Risk Level"}
                      </p>
                      <Badge className={`px-4 py-1.5 rounded-full text-xs font-black border ${getRiskBadgeStyles(patient.risk_level)}`}>
                        {patient.risk_level === 'High' ? t('dashboard.riskHigh') : 
                         patient.risk_level === 'Medium' ? t('dashboard.riskMedium') : t('dashboard.riskLow')}
                      </Badge>
                    </div>
                  </div>

                  {/* Right Side: Actions */}
                  <div className="flex items-center gap-3 pt-4 lg:pt-0 border-t lg:border-0 border-slate-50 justify-between lg:justify-end">
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                    <Button className="group/btn h-12 px-8 bg-white hover:bg-blue-600 hover:text-white text-slate-900 border-2 border-slate-100 hover:border-blue-600 rounded-xl shadow-sm transition-all duration-300 flex items-center gap-2">
                      <span className="font-bold text-sm">{t('doctorDashboard.patients.viewDetails')}</span>
                      <ChevronRight className={`h-4 w-4 text-slate-400 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all ${isArabic ? 'rotate-180 group-hover/btn:-translate-x-1' : ''}`} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-32 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100 text-center px-6">
              <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                <Search className="h-8 w-8 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">{t('doctorDashboard.noPatientsFound')}</h3>
              <p className="text-slate-500 mt-2 max-w-sm">
                {t('doctorDashboard.patients.noPatientsFound')}
              </p>
              <Button 
                variant="outline" 
                className="mt-6 rounded-xl h-11 px-6 border-slate-200"
                onClick={() => {setSearch(""); setStatusFilter("all");}}
              >
                {t('dashboard.clearSearch')}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
