import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';

interface RiskData {
  level: string;
  level_en: string;
  count: number;
  color: string;
}

interface RiskDistributionChartProps {
  data: {
    distribution: RiskData[];
    total: number;
  } | null;
  isLoading: boolean;
}

export default function RiskDistributionChart({ data, isLoading }: RiskDistributionChartProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  if (isLoading) {
    return (
      <Card className="col-span-1 rounded-2xl border-slate-100 shadow-sm">
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-[150px]" />
        </CardHeader>
        <CardContent className="flex justify-center items-center h-[300px]">
          <Skeleton className="h-[200px] w-[200px] rounded-full" />
        </CardContent>
      </Card>
    );
  }

  // Improved healthcare colors
  const colorMap: Record<string, string> = {
    'low': '#22c55e', // green-500
    'medium': '#eab308', // yellow-500
    'high': '#f97316', // orange-500
    'very high': '#ef4444', // red-500
  };

  const chartData = data?.distribution?.map(item => ({
    name: isRTL ? item.level : item.level_en,
    value: item.count,
    color: colorMap[item.level_en?.toLowerCase() || ''] || item.color,
  })) || [];

  return (
    <Card className="col-span-1 rounded-2xl border-slate-100 shadow-sm overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-2 pb-4 bg-slate-50/30">
        <div className="p-2 bg-purple-600 rounded-lg text-white">
          <PieIcon className="h-4 w-4" />
        </div>
        <CardTitle className="text-lg font-black text-slate-900 tracking-tight">
          {t('doctorDashboard.riskChart.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {data?.total === 0 ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-slate-400">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <PieIcon className="h-8 w-8 opacity-20" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest">{t('doctorDashboard.riskChart.empty')}</p>
          </div>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1500}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [value, t('doctorDashboard.riskChart.patients')]}
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: '1px solid #f1f5f9', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={40}
                  iconType="circle"
                  formatter={(value) => <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider ml-1">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
