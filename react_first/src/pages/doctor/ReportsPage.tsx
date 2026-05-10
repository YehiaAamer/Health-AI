import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useApiCall } from "@/hooks/useApiCall";
import { API_ENDPOINTS } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Search,
  FileText,
  AlertCircle,
  Clock,
  CheckCircle2,
  Filter,
  MoreVertical,
  ChevronRight,
  Eye,
  Download,
  Activity,
  ArrowUpRight,
  User,
  Info,
  Calendar,
  MessageSquare,
  Pill,
  Save
} from "lucide-react";
import LoadingDots from "@/components/shared/LoadingDots";

interface Report {
  id: string | number;
  patient_id: string;
  patient_name: string;
  patient_email: string;
  age: number;
  gender: string;
  probability: number;
  risk_level: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Reviewed' | 'Needs Follow-up' | 'Approved' | 'Rejected';
  date: string;
  indicators: {
    glucose: number;
    bmi: number;
    bloodPressure: number;
    insulin: number;
    skinThickness: number;
    pedigree: number;
    pregnancies: number;
  };
  ai_explanation: string;
  doctor_notes: string;
}

export default function ReportsPage() {
  const { t, i18n } = useTranslation();
  const apiCall = useApiCall();
  const isArabic = i18n.language === "ar";

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [reports, setReports] = useState<Report[]>([]);

  // Realistic Mock Data
  const mockReports: Report[] = [
    {
      id: "P1001",
      patient_id: "PID-8821",
      patient_name: isArabic ? "أحمد منصور" : "Ahmed Mansour",
      patient_email: "ahmed.m@example.com",
      age: 45,
      gender: isArabic ? "ذكر" : "Male",
      probability: 82,
      risk_level: 'High',
      status: 'Pending',
      date: "2024-05-10",
      indicators: {
        glucose: 168,
        bmi: 33.6,
        bloodPressure: 72,
        insulin: 0,
        skinThickness: 35,
        pedigree: 0.627,
        pregnancies: 0
      },
      ai_explanation: isArabic 
        ? "أظهر المريض احتمالية عالية للإصابة بالسكري بسبب ارتفاع مستويات الجلوكوز (168) ومؤشر كتلة الجسم (33.6). يوصى بإجراء فحص سريري فوري."
        : "Patient shows high probability of diabetes due to elevated glucose levels (168) and BMI (33.6). Immediate clinical follow-up is recommended.",
      doctor_notes: ""
    },
    {
      id: "P1002",
      patient_id: "PID-7732",
      patient_name: isArabic ? "سارة علي" : "Sarah Ali",
      patient_email: "sarah.a@example.com",
      age: 32,
      gender: isArabic ? "أنثى" : "Female",
      probability: 45,
      risk_level: 'Medium',
      status: 'Reviewed',
      date: "2024-05-09",
      indicators: {
        glucose: 110,
        bmi: 26.2,
        bloodPressure: 66,
        insulin: 45,
        skinThickness: 23,
        pedigree: 0.351,
        pregnancies: 1
      },
      ai_explanation: isArabic
        ? "المؤشرات ضمن النطاق المتوسط. يوصى بمراقبة الجلوكوز بانتظام وتعديل النظام الغذائي."
        : "Indicators are within medium range. Regular glucose monitoring and dietary adjustments are recommended.",
      doctor_notes: "Advised patient on sugar intake."
    },
    {
      id: "P1003",
      patient_id: "PID-9910",
      patient_name: isArabic ? "محمود حسن" : "Mahmoud Hassan",
      patient_email: "m.hassan@example.com",
      age: 58,
      gender: isArabic ? "ذكر" : "Male",
      probability: 12,
      risk_level: 'Low',
      status: 'Approved',
      date: "2024-05-08",
      indicators: {
        glucose: 85,
        bmi: 24.1,
        bloodPressure: 70,
        insulin: 0,
        skinThickness: 20,
        pedigree: 0.250,
        pregnancies: 0
      },
      ai_explanation: isArabic
        ? "جميع المؤشرات الحيوية طبيعية. لا توجد علامات خطر في الوقت الحالي."
        : "All vital indicators are normal. No risk signs at the current time.",
      doctor_notes: "Annual checkup complete. Patient is healthy."
    },
    {
      id: "P1004",
      patient_id: "PID-6654",
      patient_name: isArabic ? "ليلى إبراهيم" : "Layla Ibrahim",
      patient_email: "layla.i@example.com",
      age: 27,
      gender: isArabic ? "أنثى" : "Female",
      probability: 78,
      risk_level: 'High',
      status: 'Needs Follow-up',
      date: "2024-05-07",
      indicators: {
        glucose: 145,
        bmi: 31.0,
        bloodPressure: 80,
        insulin: 110,
        skinThickness: 29,
        pedigree: 1.250,
        pregnancies: 2
      },
      ai_explanation: isArabic
        ? "احتمالية عالية مرتبطة بالعامل الوراثي المرتفع (1.25) ومؤشر كتلة الجسم."
        : "High probability associated with high pedigree function (1.25) and BMI.",
      doctor_notes: "Needs gestational screening."
    }
  ];

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        // apiCall(API_ENDPOINTS.DOCTOR_PENDING_PREDICTIONS)
        // For demo, we use mockReports
        setTimeout(() => {
          setReports(mockReports);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Failed to fetch reports", error);
        setLoading(false);
      }
    };
    fetchReports();
  }, [apiCall, isArabic]);

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setIsDrawerOpen(true);
  };

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'blue';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending': return <Badge className="bg-slate-100 text-slate-600 border-slate-200">{t('doctorDashboard.reports.status.pending')}</Badge>;
      case 'Reviewed': return <Badge className="bg-blue-50 text-blue-600 border-blue-100">{t('doctorDashboard.reports.status.reviewed')}</Badge>;
      case 'Needs Follow-up': return <Badge className="bg-purple-50 text-purple-600 border-purple-100">{t('doctorDashboard.reports.status.needsFollowUp')}</Badge>;
      case 'Approved': return <Badge className="bg-green-50 text-green-600 border-green-100">{t('doctorDashboard.reports.status.approved')}</Badge>;
      case 'Rejected': return <Badge className="bg-red-50 text-red-600 border-red-100">{t('doctorDashboard.reports.status.rejected')}</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {t('doctorDashboard.reports.title')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('doctorDashboard.reports.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <Input
              placeholder={t('doctorDashboard.reports.searchPlaceholder')}
              className="pl-10 h-11 bg-white border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-600/20 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: t('doctorDashboard.reports.stats.total'), value: "1,284", icon: FileText, color: "blue" },
          { label: t('doctorDashboard.reports.stats.pending'), value: "42", icon: Clock, color: "orange" },
          { label: t('doctorDashboard.reports.stats.highRisk'), value: "12", icon: AlertCircle, color: "red" },
          { label: t('doctorDashboard.reports.stats.followUp'), value: "18", icon: Activity, color: "purple" },
          { label: t('doctorDashboard.reports.stats.approved'), value: "1,212", icon: CheckCircle2, color: "green" },
        ].map((stat, i) => (
          <Card key={i} className="p-5 border-none shadow-lg shadow-slate-200/50 rounded-2xl flex flex-col gap-3 group hover:scale-[1.02] transition-all">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${stat.color}-50`}>
              <stat.icon className={`h-5 w-5 text-${stat.color}-600`} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters & Table */}
      <Card className="border-none shadow-2xl shadow-slate-200/60 rounded-[2rem] overflow-hidden bg-white">
        {/* Filter Bar */}
        <div className="p-6 border-b border-slate-50 flex flex-wrap items-center justify-between gap-4 bg-slate-50/30">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" className="rounded-xl border-slate-200 h-10 px-4 text-slate-600 flex items-center gap-2">
              <Filter className="h-4 w-4" />
              {isArabic ? "تصفية" : "Filter"}
            </Button>
            <div className="h-4 w-px bg-slate-200 hidden md:block" />
            <Badge variant="secondary" className="rounded-lg h-8 px-3 bg-blue-50 text-blue-600 border-blue-100 flex items-center gap-2 cursor-pointer">
              {isArabic ? "مستوى الخطورة" : "Risk Level"}: {t('doctorDashboard.appointments.filterAll')}
            </Badge>
            <Badge variant="secondary" className="rounded-lg h-8 px-3 bg-slate-100 text-slate-500 border-slate-200 flex items-center gap-2 cursor-pointer">
              {isArabic ? "الحالة" : "Status"}: {t('doctorDashboard.appointments.filterAll')}
            </Badge>
          </div>
          <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-6 h-10 shadow-lg shadow-blue-600/20">
            {isArabic ? "تطبيق الفلاتر" : "Apply Filters"}
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" dir={isArabic ? "rtl" : "ltr"}>
            <thead>
              <tr className="bg-slate-50/50">
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-wider">{t('doctorDashboard.reports.table.patient')}</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-wider">{t('doctorDashboard.reports.table.probability')}</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-wider">{t('doctorDashboard.reports.table.indicators')}</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-wider">{t('doctorDashboard.reports.table.status')}</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-wider">{t('doctorDashboard.reports.table.date')}</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-wider text-center">{t('doctorDashboard.reports.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                        <AvatarFallback className="bg-blue-50 text-blue-600 text-xs font-bold">
                          {report.patient_name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-slate-900">{report.patient_name}</p>
                        <p className="text-xs font-semibold text-slate-400">{report.patient_id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden max-w-[80px]">
                        <div 
                          className={`h-full bg-${getRiskColor(report.risk_level)}-500 rounded-full`}
                          style={{ width: `${report.probability}%` }}
                        />
                      </div>
                      <span className={`text-sm font-black text-${getRiskColor(report.risk_level)}-600`}>
                        {report.probability}%
                      </span>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Glu</span>
                        <span className="text-xs font-bold text-slate-700">{report.indicators.glucose}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">BMI</span>
                        <span className="text-xs font-bold text-slate-700">{report.indicators.bmi}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">BP</span>
                        <span className="text-xs font-bold text-slate-700">{report.indicators.bloodPressure}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    {getStatusBadge(report.status)}
                  </td>
                  <td className="p-5 text-sm font-semibold text-slate-500">
                    {report.date}
                  </td>
                  <td className="p-5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-9 px-4 rounded-lg bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-600 font-bold text-xs transition-all"
                        onClick={() => handleViewReport(report)}
                      >
                        <Eye className="h-3.5 w-3.5 mr-2" />
                        {t('doctorDashboard.pendingReviews.reviewBtn')}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-slate-400">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Report Details Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="sm:max-w-xl w-full p-0 border-none shadow-2xl" side={isArabic ? "left" : "right"}>
          {selectedReport && (
            <div className="flex flex-col h-full bg-white overflow-hidden">
              <SheetHeader className="p-6 border-b border-slate-50 bg-slate-50/30">
                <div className="flex items-center justify-between">
                  <SheetTitle className="text-xl font-black text-slate-900">
                    {t('doctorDashboard.reports.drawer.reportId', { id: selectedReport.id })}
                  </SheetTitle>
                  <Badge className={`px-4 py-1 rounded-full text-[10px] font-black border bg-${getRiskColor(selectedReport.risk_level)}-50 text-${getRiskColor(selectedReport.risk_level)}-600 border-${getRiskColor(selectedReport.risk_level)}-100`}>
                    {selectedReport.risk_level === 'High' ? t('dashboard.riskHigh') : 
                     selectedReport.risk_level === 'Medium' ? t('dashboard.riskMedium') : t('dashboard.riskLow')}
                  </Badge>
                </div>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto">
                {/* Patient Profile */}
                <div className="p-8 flex flex-col items-center text-center border-b border-slate-50">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-xl ring-8 ring-slate-50 mb-4">
                    <AvatarFallback className="bg-blue-600 text-white text-2xl font-black">
                      {selectedReport.patient_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-2xl font-black text-slate-900">{selectedReport.patient_name}</h2>
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-400 mt-2">
                    <span>{selectedReport.patient_id}</span>
                    <span>•</span>
                    <span>{selectedReport.age} {t('dashboard.age')}</span>
                    <span>•</span>
                    <span>{selectedReport.gender}</span>
                  </div>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="prediction" className="w-full">
                  <div className="px-6 border-b border-slate-50">
                    <TabsList className="bg-transparent h-14 w-full justify-start gap-8 p-0">
                      <TabsTrigger value="prediction" className="px-0 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none font-bold text-sm text-slate-400 data-[state=active]:text-blue-600 transition-all">
                        {t('doctorDashboard.reports.drawer.tabs.prediction')}
                      </TabsTrigger>
                      <TabsTrigger value="review" className="px-0 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none font-bold text-sm text-slate-400 data-[state=active]:text-blue-600 transition-all">
                        {t('doctorDashboard.reports.drawer.tabs.review')}
                      </TabsTrigger>
                      <TabsTrigger value="medications" className="px-0 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none font-bold text-sm text-slate-400 data-[state=active]:text-blue-600 transition-all">
                        {t('doctorDashboard.reports.drawer.tabs.medications')}
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="prediction" className="p-8 space-y-8 m-0 animate-in fade-in duration-500">
                    {/* Prediction Score */}
                    <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-full border-4 border-${getRiskColor(selectedReport.risk_level)}-500 flex items-center justify-center`}>
                          <span className={`text-xl font-black text-${getRiskColor(selectedReport.risk_level)}-600`}>{selectedReport.probability}%</span>
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 uppercase tracking-wider">{t('doctorDashboard.prediction.risk')}</p>
                          <p className={`text-xs font-bold text-${getRiskColor(selectedReport.risk_level)}-600`}>{t('doctorDashboard.reports.stats.highRisk')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t('doctorDashboard.reports.table.status')}</p>
                        {getStatusBadge(selectedReport.status)}
                      </div>
                    </div>

                    {/* Indicators Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { label: t('dashboard.glucose'), value: selectedReport.indicators.glucose, icon: Activity },
                        { label: t('dashboard.bloodPressure'), value: selectedReport.indicators.bloodPressure, icon: Activity },
                        { label: t('dashboard.bmi'), value: selectedReport.indicators.bmi, icon: Activity },
                        { label: t('dashboard.insulin'), value: selectedReport.indicators.insulin, icon: Pill },
                        { label: isArabic ? "سماكة الجلد" : "Skin", value: selectedReport.indicators.skinThickness, icon: Activity },
                        { label: t('dashboard.age'), value: selectedReport.age, icon: User },
                        { label: t('dashboard.diabetesPedigree'), value: selectedReport.indicators.pedigree, icon: Info },
                        { label: t('dashboard.pregnancies'), value: selectedReport.indicators.pregnancies, icon: User },
                      ].map((ind, i) => (
                        <div key={i} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">{ind.label}</p>
                          <p className="text-lg font-black text-slate-900">{ind.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* AI Explanation Box */}
                    <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 relative overflow-hidden group">
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                            <Activity className="h-4 w-4 text-white" />
                          </div>
                          <h4 className="font-black text-blue-600 uppercase tracking-wider text-xs">{t('doctorDashboard.reports.drawer.aiExplanation')}</h4>
                        </div>
                        <p className="text-sm font-medium text-slate-600 leading-relaxed italic">
                          "{selectedReport.ai_explanation}"
                        </p>
                      </div>
                      <div className="absolute top-0 right-0 p-6 transform translate-x-4 -translate-y-4 opacity-[0.03] group-hover:scale-110 transition-transform">
                        <Activity className="h-24 w-24 text-blue-900" />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="review" className="p-8 space-y-8 m-0 animate-in fade-in duration-500">
                    <div className="space-y-4">
                      <h4 className="font-black text-slate-900 uppercase tracking-wider text-xs flex items-center gap-2">
                        <Save className="h-4 w-4 text-blue-600" />
                        {t('doctorDashboard.reports.drawer.doctorNotes')}
                      </h4>
                      <textarea 
                        className="w-full h-40 bg-slate-50 border-slate-200 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all outline-none resize-none"
                        placeholder={isArabic ? "اكتب ملاحظاتك الطبية هنا..." : "Write your medical notes here..."}
                        defaultValue={selectedReport.doctor_notes}
                      />
                    </div>

                    <div className="space-y-4 pt-4">
                      <h4 className="font-black text-slate-900 uppercase tracking-wider text-xs">{isArabic ? "اتخاذ قرار" : "Make Decision"}</h4>
                      <div className="grid grid-cols-3 gap-3">
                        <Button className="h-14 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold flex flex-col gap-0 shadow-lg shadow-green-600/20">
                          <span className="text-sm">{t('doctorDashboard.reports.drawer.actions.approve')}</span>
                        </Button>
                        <Button className="h-14 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold flex flex-col gap-0 shadow-lg shadow-red-600/20">
                          <span className="text-sm">{t('doctorDashboard.reports.drawer.actions.reject')}</span>
                        </Button>
                        <Button className="h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold flex flex-col gap-0 shadow-lg shadow-purple-600/20">
                          <span className="text-xs">{t('doctorDashboard.reports.drawer.actions.followUp')}</span>
                        </Button>
                      </div>
                    </div>

                    <Button className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-lg shadow-xl shadow-slate-900/20 mt-8">
                      {t('doctorDashboard.reports.drawer.saveReview')}
                    </Button>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
