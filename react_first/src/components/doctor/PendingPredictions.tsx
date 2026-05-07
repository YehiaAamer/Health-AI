import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Patient {
  id: number;
  name: string;
  email: string;
  profile_picture?: string | null;
}

interface Prediction {
  id: number;
  patient: Patient;
  probability: number;
  risk_level: string;
  created_at: string;
  glucose: number;
  bmi: number;
  age: number;
}

interface PendingPredictionsProps {
  predictions: Prediction[];
  isLoading: boolean;
  onReview: (id: number) => void;
}

export default function PendingPredictions({ predictions, isLoading, onReview }: PendingPredictionsProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const dateLocale = isRTL ? ar : enUS;

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'very high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getRiskLabel = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return t('prediction.riskLevels.low');
      case 'medium': return t('prediction.riskLevels.medium');
      case 'high': return t('prediction.riskLevels.high');
      case 'very high': return t('prediction.riskLevels.veryHigh');
      default: return level;
    }
  };

  if (isLoading) {
    return (
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">{t('doctorDashboard.pendingReviews.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-3 w-[100px]" />
                  </div>
                </div>
                <Skeleton className="h-8 w-[100px]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">{t('doctorDashboard.pendingReviews.title')}</CardTitle>
        {predictions.length > 0 && (
          <Button variant="ghost" size="sm" className="text-xs">
            {t('doctorDashboard.pendingReviews.viewAll')}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {predictions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {t('doctorDashboard.pendingReviews.empty')}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="py-3 px-4 font-medium text-start">{t('doctorDashboard.pendingReviews.patient')}</th>
                  <th className="py-3 px-4 font-medium text-start">{t('doctorDashboard.pendingReviews.riskLevel')}</th>
                  <th className="py-3 px-4 font-medium text-start">{t('doctorDashboard.pendingReviews.date')}</th>
                  <th className="py-3 px-4 font-medium text-end">{t('doctorDashboard.pendingReviews.action')}</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((pred) => (
                  <tr key={pred.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={pred.patient.profile_picture || undefined} />
                          <AvatarFallback>{pred.patient.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{pred.patient.name}</p>
                          <p className="text-xs text-muted-foreground">{pred.patient.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(pred.risk_level)}`}>
                        {getRiskLabel(pred.risk_level)} ({pred.probability}%)
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">
                      {formatDistanceToNow(new Date(pred.created_at), { addSuffix: true, locale: dateLocale })}
                    </td>
                    <td className="py-3 px-4 text-end">
                      <Button size="sm" onClick={() => onReview(pred.id)}>
                        {t('doctorDashboard.pendingReviews.reviewBtn')}
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
