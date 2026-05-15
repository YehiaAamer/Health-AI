import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { patientsApi } from "@/api/patients";
import type { User, Prediction } from "@/types/api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  ArrowUpDown,
  RefreshCw,
  Mail,
  Smartphone
} from "lucide-react";
import LoadingDots from "@/components/shared/LoadingDots";
import { cn } from "@/lib/utils";

export default function PatientsPage() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  
  const [patients, setPatients] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const data = await patientsApi.getPatients();
      setPatients(data);
    } catch (error) {
      console.error("Failed to fetch patients", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const fullName = `${p.first_name} ${p.last_name}`.toLowerCase();
      const matchesSearch = fullName.includes(search.toLowerCase()) ||
                           p.email?.toLowerCase().includes(search.toLowerCase());
      
      // Since we don't have risk_level directly on User, we might need to check their latest prediction
      // For now, we'll just filter by name/email
      return matchesSearch;
    });
  }, [patients, search]);

  const getRiskColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'high': return "bg-red-50 text-red-600 border-red-100";
      case 'medium': return "bg-orange-50 text-orange-600 border-orange-100";
      case 'low': return "bg-green-50 text-green-600 border-green-100";
      default: return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            {t('doctorDashboard.patients.title')}
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
            {isArabic ? "إدارة ومتابعة سجلات المرضى الخاصة بك" : "Manage and monitor your patient records"}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <Input
              placeholder={t('doctorDashboard.patients.searchPlaceholder')}
              className="pl-11 h-12 bg-white border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-600/10 transition-all font-bold"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={fetchPatients} 
            className="h-12 w-12 rounded-2xl border-slate-200 hover:bg-slate-50"
            disabled={loading}
          >
            <RefreshCw className={cn("h-5 w-5 text-slate-400", loading && "animate-spin")} />
          </Button>
          <Button className="h-12 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl shadow-xl shadow-slate-900/20 transition-all flex items-center gap-2 shrink-0 font-black uppercase text-[10px] tracking-widest">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{t('doctorDashboard.patients.addNew')}</span>
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Tabs defaultValue="all" className="w-fit" onValueChange={setStatusFilter}>
          <TabsList className="bg-slate-100/50 p-1 rounded-2xl h-12 border border-slate-200/50">
            <TabsTrigger value="all" className="rounded-xl px-8 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">{t('doctorDashboard.appointments.filterAll')}</TabsTrigger>
            <TabsTrigger value="high" className="rounded-xl px-8 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-red-600 data-[state=active]:text-white text-red-600">{t('dashboard.riskHigh')}</TabsTrigger>
            <TabsTrigger value="medium" className="rounded-xl px-8 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-orange-600 data-[state=active]:text-white text-orange-600">{t('dashboard.riskMedium')}</TabsTrigger>
            <TabsTrigger value="low" className="rounded-xl px-8 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-green-600 data-[state=active]:text-white text-green-600">{t('dashboard.riskLow')}</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-12 px-5 rounded-2xl bg-white border-slate-200 text-slate-600 flex items-center gap-2 font-black uppercase text-[10px] tracking-widest">
            <Filter className="h-4 w-4" />
            {isArabic ? "تصفية" : "Filter"}
          </Button>
          <Button variant="outline" className="h-12 px-5 rounded-2xl bg-white border-slate-200 text-slate-600 flex items-center gap-2 font-black uppercase text-[10px] tracking-widest">
            <ArrowUpDown className="h-4 w-4" />
            {isArabic ? "ترتيب" : "Sort"}
          </Button>
        </div>
      </div>

      {/* Patients List Section */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <LoadingDots />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            Syncing Patient Directory...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient) => (
              <Card 
                key={patient.id} 
                className="group p-8 bg-white border-slate-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 rounded-[2.5rem] relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <Avatar className="h-20 w-20 border-4 border-white shadow-xl ring-8 ring-slate-50/50 transition-transform group-hover:scale-105 duration-500">
                      <AvatarFallback className="bg-blue-600 text-white font-black text-xl">
                        {patient.first_name?.charAt(0) || 'P'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className="bg-slate-900 text-white px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-lg border-none">
                        #{patient.id}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">
                        {patient.first_name} {patient.last_name}
                      </h3>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        <span>{patient.email || 'No email'}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Contact</p>
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                            <Mail className="h-3.5 w-3.5" />
                          </div>
                          <div className="h-7 w-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                            <Smartphone className="h-3.5 w-3.5" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Role</p>
                        <p className="text-xs font-black text-slate-700 uppercase tracking-tighter">{patient.role || 'Patient'}</p>
                      </div>
                    </div>

                    <Button className="w-full h-12 mt-4 bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300 border-none shadow-none group/btn">
                      {t('doctorDashboard.patients.viewDetails')}
                      <ChevronRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
                {/* Decorative background element */}
                <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-slate-50/50 rounded-full group-hover:scale-150 transition-transform duration-700 -z-0" />
              </Card>
            ))
          ) : (
            <div className="col-span-full py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center px-6">
              <div className="h-24 w-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-inner">
                <UserIcon className="h-10 w-10 text-slate-300 opacity-20" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">{t('doctorDashboard.noPatientsFound')}</h3>
              <p className="text-sm font-bold text-slate-400 mt-2 max-w-sm uppercase tracking-wider">
                {t('doctorDashboard.patients.noPatientsFound')}
              </p>
              <Button 
                variant="outline" 
                className="mt-8 rounded-2xl h-12 px-8 border-slate-200 font-black uppercase text-[10px] tracking-[0.2em] hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all"
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
