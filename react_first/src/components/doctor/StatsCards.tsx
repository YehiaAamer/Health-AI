import { useTranslation } from 'react-i18next';
import { Users, FileText, CheckCircle, Activity } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface StatsCardsProps {
  stats: {
    patient_count: number;
    total_predictions: number;
    pending_reviews: number;
    today_appointments: number;
  } | null;
  isLoading: boolean;
}

export default function StatsCards({ stats, isLoading }: StatsCardsProps) {
  const { t } = useTranslation();

  const cards = [
    {
      title: t('doctorDashboard.stats.totalPatients'),
      value: stats?.patient_count ?? 0,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      trend: "+2",
      trendLabel: t('doctorDashboard.stats.thisMonth'),
    },
    {
      title: t('doctorDashboard.stats.pendingReviews'),
      value: stats?.pending_reviews ?? 0,
      icon: FileText,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      trend: "-1",
      trendLabel: t('doctorDashboard.stats.fromYesterday'),
    },
    {
      title: t('doctorDashboard.stats.todayAppointments'),
      value: stats?.today_appointments ?? 0,
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: t('doctorDashboard.stats.totalPredictions'),
      value: stats?.total_predictions ?? 0,
      icon: Activity,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
              <Skeleton className="h-8 w-[60px] mt-2" />
              <Skeleton className="h-3 w-[120px] mt-4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Card key={index} className="overflow-hidden group hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0">
              <h3 className="text-sm font-medium text-muted-foreground">
                {card.title}
              </h3>
              <div className={cn("p-2 rounded-full", card.bgColor, card.color)}>
                <card.icon className="h-4 w-4" />
              </div>
            </div>
            
            <div className="mt-4">
              <div className="text-2xl font-bold">{card.value}</div>
              
              {card.trend && (
                <div className="flex items-center mt-1 text-xs">
                  <span className={cn(
                    "font-medium",
                    card.trend.startsWith('+') ? "text-green-600" : "text-amber-600"
                  )}>
                    {card.trend}
                  </span>
                  <span className="text-muted-foreground mx-1">
                    {card.trendLabel}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
