import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowUpRight, ClipboardList } from 'lucide-react';
import type { Prediction } from '@/types/api';

interface PendingPredictionsProps {
  predictions: Prediction[];
  isLoading: boolean;
  onReview: (id: number) => void;
}

export default function PendingPredictions({ predictions, isLoading, onReview }: PendingPredictionsProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';
  const dateLocale = isRTL ? ar : enUS;

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return 'bg-green-50 text-green-600 border-green-100';
      case 'medium': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
      case 'high': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'very high': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  if (isLoading) {
    return (
      <Card className="col-span-1 lg:col-span-2 rounded-2xl border-slate-100 shadow-sm">
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-[200px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-3 w-[100px]" />
                  </div>
                </div>
                <Skeleton className="h-8 w-[80px] rounded-xl" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 lg:col-span-2 rounded-2xl border-slate-100 shadow-sm overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-4 bg-slate-50/30">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-600 rounded-lg text-white">
            <ClipboardList className="h-4 w-4" />
          </div>
          <CardTitle className="text-lg font-black text-slate-900 tracking-tight">
            {t('doctorDashboard.pendingReviews.title')}
          </CardTitle>
        </div>
        {predictions.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/doctor-dashboard/reports')}
            className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600"
          >
            {t('doctorDashboard.pendingReviews.viewAll')}
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        {predictions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <ClipboardList className="h-8 w-8 opacity-20" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest">{t('doctorDashboard.pendingReviews.empty')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 border-y border-slate-100">
                  <th className="py-3 px-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-start">{t('doctorDashboard.pendingReviews.patient')}</th>
                  <th className="py-3 px-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-start">{t('doctorDashboard.pendingReviews.riskLevel')}</th>
                  <th className="py-3 px-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-start">{t('doctorDashboard.pendingReviews.date')}</th>
                  <th className="py-3 px-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-end">{t('doctorDashboard.pendingReviews.action')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {predictions.map((pred) => (
                  <tr key={pred.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                          <AvatarFallback className="bg-blue-100 text-blue-600 font-bold text-xs">
                            {pred.patient_name?.charAt(0) || 'P'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{pred.patient_name || 'Anonymous'}</p>
                          <p className="text-[10px] font-medium text-slate-500">#{pred.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter border ${getRiskColor(pred.risk_level || '')}`}>
                        {pred.risk_level || 'Unknown'} ({Math.round(pred.probability || 0)}%)
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <span className="text-[10px] font-bold">
                          {(() => {
                            try {
                              return pred.created_at 
                                ? formatDistanceToNow(new Date(pred.created_at), { addSuffix: true, locale: dateLocale })
                                : '';
                            } catch (e) {
                              return '';
                            }
                          })()}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-end">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => onReview(pred.id)}
                        className="rounded-xl h-8 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50 hover:text-blue-700 gap-1"
                      >
                        {t('doctorDashboard.pendingReviews.reviewBtn')}
                        <ArrowUpRight className="h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
