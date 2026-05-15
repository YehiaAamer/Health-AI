import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { Activity, Check, Calendar, MessageSquare, Bell, History } from 'lucide-react';
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'prediction': return <Activity className="h-3.5 w-3.5 text-purple-600" />;
      case 'review': return <Check className="h-3.5 w-3.5 text-green-600" />;
      case 'appointment': return <Calendar className="h-3.5 w-3.5 text-blue-600" />;
      case 'message': return <MessageSquare className="h-3.5 w-3.5 text-amber-600" />;
      default: return <Bell className="h-3.5 w-3.5 text-slate-500" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'prediction': return 'bg-purple-50 border-purple-100';
      case 'review': return 'bg-green-50 border-green-100';
      case 'appointment': return 'bg-blue-50 border-blue-100';
      case 'message': return 'bg-amber-50 border-amber-100';
      default: return 'bg-slate-50 border-slate-100';
    }
  };

  if (isLoading) {
    return (
      <Card className="col-span-1 lg:col-span-3 rounded-2xl border-slate-100 shadow-sm">
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-[180px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4 items-start">
                <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-3 w-[80px]" />
                  </div>
                  <Skeleton className="h-3 w-full max-w-[400px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 lg:col-span-3 rounded-2xl border-slate-100 shadow-sm overflow-hidden h-full">
      <CardHeader className="flex flex-row items-center gap-2 pb-4 bg-slate-50/30">
        <div className="p-2 bg-slate-900 rounded-lg text-white">
          <History className="h-4 w-4" />
        </div>
        <CardTitle className="text-lg font-black text-slate-900 tracking-tight">
          {t('doctorDashboard.activity.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <History className="h-8 w-8 opacity-20" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest">{t('doctorDashboard.activity.empty')}</p>
          </div>
        ) : (
          <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-100">
            {activities.map((activity, index) => (
              <div key={index} className="relative flex items-start gap-6 group">
                {/* Timeline dot/icon */}
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shadow-sm z-10 shrink-0",
                  getActivityColor(activity.type)
                )}>
                  {getActivityIcon(activity.type)}
                </div>
                
                {/* Content Area */}
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-bold text-slate-900 truncate tracking-tight">{activity.title}</h4>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter whitespace-nowrap ml-4 bg-slate-50 px-2 py-0.5 rounded-md">
                      {(() => {
                        try {
                          return activity.created_at 
                            ? formatDistanceToNow(new Date(activity.created_at), { addSuffix: true, locale: dateLocale })
                            : '';
                        } catch (e) {
                          return '';
                        }
                      })()}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-500 leading-relaxed">
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
