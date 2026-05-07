import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useApiCall } from "@/hooks/useApiCall";
import { API_ENDPOINTS } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingDots from "@/components/shared/LoadingDots";

export default function ReportsPage() {
  const { t } = useTranslation();
  const apiCall = useApiCall();
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const data = await apiCall(API_ENDPOINTS.DOCTOR_PENDING_PREDICTIONS);
        setPredictions(data.predictions || []);
      } catch (error) {
        console.error("Failed to fetch reports", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPredictions();
  }, [apiCall]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('doctorDashboard.sidebar.reports')}</h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <LoadingDots />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {predictions.length > 0 ? (
            predictions.map((pred: any) => (
              <Card key={pred.id}>
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-orange-100 p-3 rounded-full">
                      <FileText className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{pred.patient_name}</h3>
                      <p className="text-sm text-muted-foreground">{t('doctorDashboard.prediction.risk')}: {pred.risk_score}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" /> {t('doctorDashboard.view')}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" /> {t('doctorDashboard.download')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="p-12 text-center text-muted-foreground">
              {t('doctorDashboard.noReports')}
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
