import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { Activity, Check, Calendar, MessageSquare, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityItem {
  type: string;
  icon: string;
  title: string;
  description: string;
  related_id: number;
  created_at: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
  isLoading: boolean;
}

export default function RecentActivity({ activities, isLoading }: RecentActivityProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const dateLocale = isRTL ? ar : enUS;

  const getActivityIcon = (type: string, iconName: string) => {
    switch (type) {
      case 'prediction': return <Activity className="h-4 w-4 text-purple-500" />;
      case 'review': return <Check className="h-4 w-4 text-green-500" />;
      case 'appointment': return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'message': return <MessageSquare className="h-4 w-4 text-amber-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'prediction': return 'bg-purple-500/10 border-purple-200 dark:border-purple-900';
      case 'review': return 'bg-green-500/10 border-green-200 dark:border-green-900';
      case 'appointment': return 'bg-blue-500/10 border-blue-200 dark:border-blue-900';
      case 'message': return 'bg-amber-500/10 border-amber-200 dark:border-amber-900';
      default: return 'bg-gray-500/10 border-gray-200 dark:border-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card className="col-span-1 lg:col-span-3">
        <CardHeader>
          <CardTitle className="text-lg">{t('doctorDashboard.activity.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 items-start">
                <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-3 w-[80px]" />
                  </div>
                  <Skeleton className="h-3 w-full max-w-[300px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 lg:col-span-3 h-full">
      <CardHeader>
        <CardTitle className="text-lg">{t('doctorDashboard.activity.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {t('doctorDashboard.activity.empty')}
          </div>
        ) : (
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-muted before:to-transparent">
            {activities.map((activity, index) => (
              <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                {/* Timeline dot/icon */}
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full border-2 border-background z-10 shrink-0",
                  getActivityColor(activity.type)
                )}>
                  {getActivityIcon(activity.type, activity.icon)}
                </div>
                
                {/* Spacer for desktop layout */}
                <div className="hidden md:block w-[calc(50%-2rem)]" />
                
                {/* Content Card */}
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] bg-card border shadow-sm rounded-lg p-3 mx-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-semibold">{activity.title}</h4>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true, locale: dateLocale })}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {activity.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
