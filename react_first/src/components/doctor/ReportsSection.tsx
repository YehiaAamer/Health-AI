import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, BarChart2, TrendingUp, Users } from 'lucide-react';

export default function ReportsSection() {
  const { t } = useTranslation();

  const reports = [
    {
      id: 1,
      title: t('doctorDashboard.reports.monthlySummary'),
      icon: BarChart2,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      date: "Oct 2023",
    },
    {
      id: 2,
      title: t('doctorDashboard.reports.riskAnalysis'),
      icon: TrendingUp,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      date: "Q3 2023",
    },
    {
      id: 3,
      title: t('doctorDashboard.reports.patientDemographics'),
      icon: Users,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      date: "Updated Today",
    },
  ];

  return (
    <Card className="h-full">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          {t('doctorDashboard.reports.title')}
        </CardTitle>
        <Button variant="ghost" size="sm" className="text-xs">
          {t('doctorDashboard.reports.viewAll')}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {reports.map((report) => (
            <div 
              key={report.id} 
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${report.bgColor} ${report.color}`}>
                  <report.icon className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">{report.title}</h4>
                  <p className="text-xs text-muted-foreground">{report.date}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Download className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          ))}
        </div>
        
        <Button className="w-full mt-4" variant="outline">
          {t('doctorDashboard.reports.generateNew')}
        </Button>
      </CardContent>
    </Card>
  );
}
