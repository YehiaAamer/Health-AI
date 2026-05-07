import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

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
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-lg">{t('doctorDashboard.riskChart.title')}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-[300px]">
          <Skeleton className="h-[200px] w-[200px] rounded-full" />
        </CardContent>
      </Card>
    );
  }

  // Format data for Recharts, handling translation
  const chartData = data?.distribution.map(item => ({
    name: isRTL ? item.level : item.level_en,
    value: item.count,
    color: item.color,
  })) || [];

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-lg">{t('doctorDashboard.riskChart.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        {data?.total === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            {t('doctorDashboard.riskChart.empty')}
          </div>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [value, t('doctorDashboard.riskChart.patients')]}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
