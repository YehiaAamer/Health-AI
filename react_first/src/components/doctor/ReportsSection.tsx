import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Download, 
  BarChart2, 
  TrendingUp, 
  Users, 
  ChevronRight,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ReportsSection() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isArabic = i18n.language === 'ar';

  const reports = [
    {
      id: 1,
      title: t('doctorDashboard.reports.monthlySummary'),
      icon: BarChart2,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      date: isArabic ? "أكتوبر 2023" : "Oct 2023",
      trend: "+12%",
    },
    {
      id: 2,
      title: t('doctorDashboard.reports.riskAnalysis'),
      icon: TrendingUp,
      color: "text-red-600",
      bgColor: "bg-red-50",
      date: isArabic ? "الربع الثالث 2023" : "Q3 2023",
      trend: "Critical",
    },
    {
      id: 3,
      title: t('doctorDashboard.reports.patientDemographics'),
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
      date: isArabic ? "تم التحديث اليوم" : "Updated Today",
      trend: "Steady",
    },
  ];

  return (
    <Card className="h-full border-none shadow-2xl shadow-slate-200/40 rounded-[2.5rem] bg-white overflow-hidden">
      <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
        <div className={cn("flex flex-col gap-1", isArabic && "text-right")}>
          <div className={cn("flex items-center gap-3", isArabic && "flex-row-reverse")}>
            <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-900/20">
              <FileText className="h-5 w-5" />
            </div>
            <CardTitle className="text-xl font-black text-slate-900 tracking-tight">
              {t('doctorDashboard.reports.title')}
            </CardTitle>
          </div>
          <CardDescription className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">
            {isArabic ? "تقارير وتحليلات النظام" : "System Reports & Analytics"}
          </CardDescription>
        </div>
        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-300 hover:text-blue-600 transition-colors">
          <ChevronRight className={cn("h-5 w-5", isArabic && "rotate-180")} />
        </Button>
      </CardHeader>
      
      <CardContent className="p-8 pt-4">
        <div className="space-y-4">
          {reports.map((report) => (
            <div 
              key={report.id} 
              className={cn(
                "flex items-center justify-between p-5 rounded-[1.75rem] bg-slate-50/50 border border-transparent hover:bg-white hover:border-blue-100 hover:shadow-xl hover:shadow-blue-600/5 transition-all duration-500 group cursor-pointer",
                isArabic && "flex-row-reverse"
              )}
            >
              <div className={cn("flex items-center gap-4", isArabic && "flex-row-reverse")}>
                <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110", report.bgColor, report.color)}>
                  <report.icon className="h-5 w-5" />
                </div>
                <div className={isArabic ? "text-right" : "text-left"}>
                  <h4 className="text-[13px] font-black text-slate-900 leading-tight mb-1">{report.title}</h4>
                  <div className={cn("flex items-center gap-2", isArabic && "flex-row-reverse")}>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{report.date}</p>
                    <span className="h-1 w-1 bg-slate-200 rounded-full" />
                    <span className={cn("text-[9px] font-black uppercase tracking-widest", report.trend === 'Critical' ? "text-red-500" : "text-blue-500")}>
                      {report.trend}
                    </span>
                  </div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 rounded-xl text-slate-300 hover:text-blue-600 hover:bg-blue-50 transition-all opacity-0 group-hover:opacity-100"
              >
                <Download className="h-4.5 w-4.5" />
              </Button>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-2 gap-3 mt-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/doctor-dashboard/reports')}
            className="h-12 rounded-2xl border-slate-100 text-slate-600 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"
          >
            {t('doctorDashboard.reports.viewAll')}
          </Button>
          <Button 
            onClick={() => navigate('/doctor-dashboard/reports')}
            className="h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-600/20 transition-all gap-2"
          >
            <Plus className="h-4 w-4" />
            {t('doctorDashboard.reports.generateNew')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
