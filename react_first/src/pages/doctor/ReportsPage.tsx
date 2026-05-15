import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { reportsApi } from "@/api/reports";
import type { Prediction, ReviewStatus } from "@/types/api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  Eye,
  Download,
  Activity,
  User,
  Info,
  Pill,
  Save,
  Check,
  X,
  RefreshCw,
  Calendar
} from "lucide-react";
import { toast } from "sonner";
import LoadingDots from "@/components/shared/LoadingDots";
import { cn } from "@/lib/utils";

export default function ReportsPage() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const isArabic = i18n.language === "ar";

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedReport, setSelectedReport] = useState<Prediction | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [reports, setReports] = useState<Prediction[]>([]);
  
  // Filter state
  const [riskFilter, setRiskFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Review form state
  const [doctorNotes, setDoctorNotes] = useState("");
  const [decision, setDecision] = useState<ReviewStatus>('pending');

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await reportsApi.getReports({
        risk: riskFilter || undefined,
        status: statusFilter || undefined
      });
      setReports(data);
      
      // Check for deep link report ID from navigation state
      const state = location.state as { openReportId?: number };
      if (state?.openReportId) {
        const reportToOpen = data.find(r => r.id === state.openReportId);
        if (reportToOpen) {
          setSelectedReport(reportToOpen);
          setDecision(reportToOpen.review_status as ReviewStatus || 'pending');
          setDoctorNotes(reportToOpen.message || "");
          setIsDrawerOpen(true);
          // Clear location state to prevent reopening on refresh
          window.history.replaceState({}, document.title);
        }
      }
    } catch (error) {
      console.error("Failed to fetch reports", error);
      toast.error(t('doctorDashboard.reports.fetchError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [riskFilter, statusFilter]);

  const filteredReports = useMemo(() => {
    return reports.filter(report => 
      (report.patient_name || "").toLowerCase().includes(search.toLowerCase()) ||
      report.id?.toString().includes(search)
    );
  }, [reports, search]);

  const stats = useMemo(() => {
    return {
      total: reports.length,
      pending: reports.filter(r => r.review_status === 'pending').length,
      highRisk: reports.filter(r => r.risk_level === 'High').length,
      followUp: reports.filter(r => r.review_status === 'needs_followup').length,
      approved: reports.filter(r => r.review_status === 'approved').length,
    };
  }, [reports]);

  const handleViewReport = (report: Prediction) => {
    setSelectedReport(report);
    setDoctorNotes(report.message || ""); // Using message as placeholder for notes if needed
    setDecision(report.review_status);
    setIsDrawerOpen(true);
  };

  const handleSaveReview = async () => {
    if (!selectedReport) return;
    
    try {
      setSubmitting(true);
      await reportsApi.submitReview(selectedReport.id, {
        decision: decision,
        notes: doctorNotes,
        // Medications can be added here if we implement a medication selector UI
      });
      toast.success(t('doctorDashboard.reports.saveSuccess'));
      setIsDrawerOpen(false);
      fetchReports(); // Refresh the list
    } catch (error) {
      console.error("Failed to save review", error);
      toast.error(t('doctorDashboard.reports.saveError'));
    } finally {
      setSubmitting(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'high': return 'red';
      case 'very high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'blue';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge className="bg-slate-100 text-slate-600 border-slate-200 uppercase text-[10px] font-black">{t('doctorDashboard.reports.status.pending')}</Badge>;
      case 'reviewed': return <Badge className="bg-blue-50 text-blue-600 border-blue-100 uppercase text-[10px] font-black">{t('doctorDashboard.reports.status.reviewed')}</Badge>;
      case 'needs_followup': return <Badge className="bg-purple-50 text-purple-600 border-purple-100 uppercase text-[10px] font-black">{t('doctorDashboard.reports.status.needsFollowUp')}</Badge>;
      case 'approved': return <Badge className="bg-green-50 text-green-600 border-green-100 uppercase text-[10px] font-black">{t('doctorDashboard.reports.status.approved')}</Badge>;
      case 'rejected': return <Badge className="bg-red-50 text-red-600 border-red-100 uppercase text-[10px] font-black">{t('doctorDashboard.reports.status.rejected')}</Badge>;
      default: return <Badge className="uppercase text-[10px] font-black">{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            {t('doctorDashboard.reports.title')}
          </h1>
          <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">
            {t('doctorDashboard.reports.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <Input
              placeholder={t('doctorDashboard.reports.searchPlaceholder')}
              className="pl-10 h-12 bg-white border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-600/10 transition-all font-bold"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={fetchReports} 
            className="h-12 w-12 rounded-2xl border-slate-200 hover:bg-slate-50"
            disabled={loading}
          >
            <RefreshCw className={cn("h-5 w-5 text-slate-400", loading && "animate-spin")} />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: t('doctorDashboard.reports.stats.total'), value: stats.total, icon: FileText, color: "blue" },
          { label: t('doctorDashboard.reports.stats.pending'), value: stats.pending, icon: Clock, color: "orange" },
          { label: t('doctorDashboard.reports.stats.highRisk'), value: stats.highRisk, icon: AlertCircle, color: "red" },
          { label: t('doctorDashboard.reports.stats.followUp'), value: stats.followUp, icon: Activity, color: "purple" },
          { label: t('doctorDashboard.reports.stats.approved'), value: stats.approved, icon: CheckCircle2, color: "green" },
        ].map((stat, i) => (
          <Card key={i} className="p-6 border-slate-100 shadow-sm rounded-2xl flex flex-col gap-4 group hover:shadow-lg transition-all duration-300">
            <div className={cn(`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors`, `bg-${stat.color}-50`)}>
              <stat.icon className={cn(`h-6 w-6`, `text-${stat.color}-600`)} />
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters & Table */}
      <Card className="border-slate-100 shadow-sm rounded-[2rem] overflow-hidden bg-white">
        {/* Filter Bar */}
        <div className="p-6 border-b border-slate-50 flex flex-wrap items-center justify-between gap-4 bg-slate-50/30">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" className="rounded-xl border-slate-200 h-10 px-4 text-[11px] font-black uppercase tracking-widest text-slate-600 flex items-center gap-2">
              <Filter className="h-4 w-4" />
              {t('doctorDashboard.reports.filter')}
            </Button>
            <div className="h-4 w-px bg-slate-200 hidden md:block" />
            
            {/* Risk Filter Select Simulation */}
            <div className="flex gap-2">
              {['High', 'Medium', 'Low'].map((risk) => (
                <Badge 
                  key={risk}
                  variant={riskFilter === risk ? "default" : "secondary"}
                  onClick={() => setRiskFilter(riskFilter === risk ? null : risk)}
                  className={cn(
                    "rounded-lg h-8 px-3 cursor-pointer uppercase text-[10px] font-black tracking-widest transition-all",
                    riskFilter === risk ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  )}
                >
                  {risk}
                </Badge>
              ))}
            </div>

            <div className="h-4 w-px bg-slate-200 hidden md:block" />

            {/* Status Filter Select Simulation */}
            <div className="flex gap-2">
              {['pending', 'approved', 'needs_followup'].map((status) => (
                <Badge 
                  key={status}
                  variant={statusFilter === status ? "default" : "secondary"}
                  onClick={() => setStatusFilter(statusFilter === status ? null : status)}
                  className={cn(
                    "rounded-lg h-8 px-3 cursor-pointer uppercase text-[10px] font-black tracking-widest transition-all",
                    statusFilter === status ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  )}
                >
                  {status?.replace('_', ' ') || status}
                </Badge>
              ))}
            </div>
          </div>
          
          {(riskFilter || statusFilter) && (
            <Button 
              variant="ghost" 
              onClick={() => { setRiskFilter(null); setStatusFilter(null); }}
              className="text-[10px] font-black uppercase tracking-widest text-red-500"
            >
              {t('doctorDashboard.reports.clearFilters')}
            </Button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <LoadingDots />
              <p className="mt-4 text-xs font-black uppercase tracking-widest text-slate-400">{t('doctorDashboard.reports.loading')}</p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400">
              <FileText className="h-16 w-16 opacity-10 mb-4" />
              <p className="text-xs font-black uppercase tracking-widest">{t('doctorDashboard.reports.noReports')}</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse" dir={isArabic ? "rtl" : "ltr"}>
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('doctorDashboard.reports.table.patient')}</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('doctorDashboard.reports.table.probability')}</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('doctorDashboard.reports.table.indicators')}</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('doctorDashboard.reports.table.status')}</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('doctorDashboard.reports.table.date')}</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{t('doctorDashboard.reports.table.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => handleViewReport(report)}>
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-11 w-11 border-2 border-white shadow-sm ring-4 ring-slate-50">
                          <AvatarFallback className="bg-blue-100 text-blue-600 font-black text-xs">
                            {report.patient_name?.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase() || 'P'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-black text-slate-900 tracking-tight">{report.patient_name || 'Anonymous'}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">#{report.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden max-w-[100px]">
                          <div 
                            className={cn(`h-full rounded-full transition-all duration-1000`, `bg-${getRiskColor(report.risk_level)}-500`)}
                            style={{ width: `${report.probability || 0}%` }}
                          />
                        </div>
                        <span className={cn(`text-xs font-black tracking-tighter`, `text-${getRiskColor(report.risk_level || '')}-600`)}>
                          {Math.round(report.probability || 0)}%
                        </span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Glu</span>
                          <span className="text-xs font-black text-slate-900">{report.glucose}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">BMI</span>
                          <span className="text-xs font-black text-slate-900">{report.bmi}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">BP</span>
                          <span className="text-xs font-black text-slate-900">{report.blood_pressure}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      {getStatusBadge(report.review_status)}
                    </td>
                    <td className="p-6">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                        {new Date(report.created_at).toLocaleDateString(i18n.language, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-10 px-5 rounded-xl bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-600 font-black text-[10px] uppercase tracking-widest transition-all"
                          onClick={(e) => { e.stopPropagation(); handleViewReport(report); }}
                        >
                          <Eye className="h-3.5 w-3.5 mr-2" />
                          {t('doctorDashboard.pendingReviews.reviewBtn')}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* Report Details Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="sm:max-w-2xl w-full p-0 border-none shadow-2xl" side={isArabic ? "left" : "right"}>
          {selectedReport && (
            <div className="flex flex-col h-full bg-white overflow-hidden">
              <SheetHeader className="p-8 border-b border-slate-50 bg-slate-50/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-600 rounded-xl text-white">
                      <FileText className="h-5 w-5" />
                    </div>
                    <SheetTitle className="text-2xl font-black text-slate-900 tracking-tight">
                      {t('doctorDashboard.reports.drawer.reportId', { id: selectedReport.id })}
                    </SheetTitle>
                  </div>
                  <Badge className={cn(`px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border`, `bg-${getRiskColor(selectedReport.risk_level)}-50 text-${getRiskColor(selectedReport.risk_level)}-600 border-${getRiskColor(selectedReport.risk_level)}-100`)}>
                    {selectedReport.risk_level} Risk
                  </Badge>
                </div>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto">
                {/* Patient Profile Header */}
                <div className="p-10 flex flex-col items-center text-center border-b border-slate-50 bg-gradient-to-b from-transparent to-slate-50/50">
                  <Avatar className="h-32 w-32 border-8 border-white shadow-2xl ring-1 ring-slate-100 mb-6">
                    <AvatarFallback className="bg-slate-100 text-slate-900 font-black text-sm">
                      {selectedReport.patient_name?.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase() || 'P'}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">{selectedReport.patient_name || 'Anonymous Patient'}</h2>
                  <div className="flex items-center gap-4 text-xs font-black text-slate-400 mt-3 uppercase tracking-widest">
                    <span>ID: #{selectedReport.id}</span>
                    <span>•</span>
                    <span>{selectedReport.age} {t('dashboard.age')}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(selectedReport.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Content Tabs */}
                <Tabs defaultValue="prediction" className="w-full">
                  <div className="px-10 border-b border-slate-50">
                    <TabsList className="bg-transparent h-16 w-full justify-start gap-10 p-0">
                      <TabsTrigger value="prediction" className="px-0 h-full rounded-none border-b-4 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none font-black text-xs uppercase tracking-widest text-slate-400 data-[state=active]:text-blue-600 transition-all">
                        {t('doctorDashboard.reports.drawer.tabs.prediction')}
                      </TabsTrigger>
                      <TabsTrigger value="review" className="px-0 h-full rounded-none border-b-4 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none font-black text-xs uppercase tracking-widest text-slate-400 data-[state=active]:text-blue-600 transition-all">
                        {t('doctorDashboard.reports.drawer.tabs.review')}
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="prediction" className="p-10 space-y-10 m-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {/* Probability Card */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white flex flex-col justify-center relative overflow-hidden shadow-2xl">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 relative z-10">AI Confidence</p>
                        <div className="flex items-end gap-2 relative z-10">
                          <span className="text-6xl font-black leading-none">{Math.round(selectedReport.probability)}%</span>
                          <span className="text-xs font-bold text-slate-400 mb-2 uppercase">Probability</span>
                        </div>
                        <Activity className="absolute -bottom-6 -right-6 h-32 w-32 text-white/5" />
                      </div>

                      <div className={cn(`p-8 rounded-[2.5rem] flex flex-col justify-center border-4`, `bg-${getRiskColor(selectedReport.risk_level)}-50 border-${getRiskColor(selectedReport.risk_level)}-500/10`)}>
                        <p className={cn(`text-[10px] font-black uppercase tracking-[0.2em] mb-2`, `text-${getRiskColor(selectedReport.risk_level)}-600`)}>Risk Assessment</p>
                        <div className="flex items-center gap-3">
                          <AlertCircle className={cn(`h-8 w-8`, `text-${getRiskColor(selectedReport.risk_level)}-500`)} />
                          <span className={cn(`text-4xl font-black tracking-tighter`, `text-${getRiskColor(selectedReport.risk_level)}-600`)}>{selectedReport.risk_level}</span>
                        </div>
                      </div>
                    </div>

                    {/* Clinical Indicators Grid */}
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{t('doctorDashboard.reports.clinicalIndicators')}</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                          { label: t('dashboard.glucose'), value: selectedReport.glucose, unit: "mg/dL" },
                          { label: t('dashboard.bloodPressure'), value: selectedReport.blood_pressure, unit: "mmHg" },
                          { label: t('dashboard.bmi'), value: selectedReport.bmi, unit: "kg/m²" },
                          { label: t('dashboard.insulin'), value: selectedReport.insulin, unit: "mu U/ml" },
                          { label: isArabic ? "سماكة الجلد" : "Skin", value: selectedReport.skin_thickness, unit: "mm" },
                          { label: t('dashboard.age'), value: selectedReport.age, unit: "Years" },
                          { label: t('dashboard.diabetesPedigree'), value: selectedReport.diabetes_pedigree_function, unit: "Score" },
                          { label: t('dashboard.pregnancies'), value: selectedReport.pregnancies, unit: "Count" },
                        ].map((ind, i) => (
                          <div key={i} className="p-5 bg-white border border-slate-100 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:border-blue-200 transition-colors group">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 group-hover:text-blue-500 transition-colors">{ind.label}</p>
                            <div className="flex items-baseline gap-1">
                              <span className="text-xl font-black text-slate-900 tracking-tight">{ind.value}</span>
                              <span className="text-[9px] font-bold text-slate-400">{ind.unit}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Insights Section */}
                    <div className="p-10 bg-blue-50 rounded-[3rem] border border-blue-100 relative overflow-hidden group shadow-sm">
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
                            <RefreshCw className="h-5 w-5 text-white" />
                          </div>
                          <h4 className="font-black text-blue-600 uppercase tracking-[0.2em] text-xs">{t('doctorDashboard.reports.aiInsight')}</h4>
                        </div>
                        <p className="text-lg font-bold text-slate-700 leading-relaxed tracking-tight">
                          {selectedReport.message || "Based on the clinical indicators provided, the AI model has identified significant risk patterns. Immediate medical review and diagnostic verification are recommended."}
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="review" className="p-10 space-y-10 m-0 animate-in fade-in duration-500">
                    {/* Action Selector */}
                    <div className="space-y-6">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{t('doctorDashboard.reports.clinicalDecision')}</h4>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { id: 'approved' as ReviewStatus, label: t('doctorDashboard.reports.drawer.actions.approve'), icon: Check, color: 'bg-green-600 shadow-green-600/20' },
                          { id: 'rejected' as ReviewStatus, label: t('doctorDashboard.reports.drawer.actions.reject'), icon: X, color: 'bg-red-600 shadow-red-600/20' },
                          { id: 'needs_followup' as ReviewStatus, label: t('doctorDashboard.reports.drawer.actions.followUp'), icon: RefreshCw, color: 'bg-purple-600 shadow-purple-600/20' },
                        ].map((act) => (
                          <button
                            key={act.id}
                            onClick={() => setDecision(act.id)}
                            className={cn(
                              "flex flex-col items-center justify-center gap-3 p-6 rounded-[2.5rem] transition-all duration-300 border-4",
                              decision === act.id 
                                ? `${act.color} text-white border-transparent shadow-2xl scale-105` 
                                : "bg-white border-slate-50 text-slate-400 hover:border-slate-100"
                            )}
                          >
                            <div className={cn("p-3 rounded-2xl", decision === act.id ? "bg-white/20" : "bg-slate-50")}>
                              <act.icon className="h-6 w-6" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest">{act.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Clinical Notes */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between ml-2">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('doctorDashboard.reports.notesTitle')}</h4>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{t('doctorDashboard.reports.optional')}</span>
                      </div>
                      <textarea 
                        className="w-full h-52 bg-slate-50 border-2 border-slate-50 rounded-[2.5rem] p-8 text-sm font-bold text-slate-700 focus:bg-white focus:border-blue-600/20 focus:ring-0 transition-all outline-none resize-none shadow-inner"
                        placeholder={t('doctorDashboard.reports.notesPlaceholder')}
                        value={doctorNotes}
                        onChange={(e) => setDoctorNotes(e.target.value)}
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6">
                      <Button 
                        onClick={handleSaveReview}
                        disabled={submitting || decision === 'pending'}
                        className="w-full h-20 bg-slate-900 hover:bg-slate-800 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-slate-900/30 group transition-all"
                      >
                        {submitting ? (
                          <LoadingDots color="white" />
                        ) : (
                          <div className="flex items-center gap-3">
                            <Save className="h-6 w-6 group-hover:scale-110 transition-transform" />
                            {t('doctorDashboard.reports.drawer.saveReview')}
                          </div>
                        )}
                      </Button>
                      <p className="text-center text-[10px] font-bold text-slate-400 uppercase mt-4 tracking-widest">
                        {t('doctorDashboard.reports.notified')}
                      </p>
                    </div>
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
