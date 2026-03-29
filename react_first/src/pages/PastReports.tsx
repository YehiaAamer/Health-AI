// src/pages/PastReports.tsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { apiCall, API_ENDPOINTS } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowRight, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Shared/Header";
import Footer from "@/components/Shared/Footer";
import { useTranslation } from "react-i18next";

interface Prediction {
  id: number;
  pregnancies: number;
  glucose: number;
  blood_pressure: number;
  skin_thickness: number;
  insulin: number;
  bmi: number;
  diabetes_pedigree_function: number;
  age: number;
  probability: number;
  risk_level: string;
  message: string;
  created_at: string;
}

export default function PastReports() {
  const { user, isAuthenticated } = useAuth();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await apiCall<{
          count: number;
          predictions: Prediction[];
        }>(API_ENDPOINTS.GET_PREDICTIONS, {
          method: "GET",
        });

        setPredictions(data.predictions || []);

        if (data.predictions && data.predictions.length === 0) {
          toast.info(t("pastReportsPage.noReportsToast"));
        }
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError(t("pastReportsPage.fetchError"));
        toast.error(t("pastReportsPage.dataError"));
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && user) {
      fetchPredictions();
    }
  }, [isAuthenticated, user, t]);

  const normalizeRiskLevel = (riskLevel?: string) => {
    const risk = String(riskLevel || "").trim().toLowerCase();

    if (
      risk.includes("very high") ||
      risk.includes("مرتفع جدًا") ||
      risk.includes("مرتفع جدا")
    ) {
      return "veryHigh";
    }

    if (
      risk.includes("high") ||
      risk.includes("مرتفع") ||
      risk.includes("عالي")
    ) {
      return "high";
    }

    if (
      risk.includes("medium") ||
      risk.includes("moderate") ||
      risk.includes("متوسط")
    ) {
      return "medium";
    }

    if (
      risk.includes("low") ||
      risk.includes("منخفض") ||
      risk.includes("قليل")
    ) {
      return "low";
    }

    return "unknown";
  };

  const getLocalizedRiskLabel = (riskLevel?: string) => {
    const normalized = normalizeRiskLevel(riskLevel);

    switch (normalized) {
      case "veryHigh":
        return t("pastReportsPage.riskVeryHigh");
      case "high":
        return t("pastReportsPage.riskHigh");
      case "medium":
        return t("pastReportsPage.riskMedium");
      case "low":
        return t("pastReportsPage.riskLow");
      default:
        return riskLevel || t("pastReportsPage.unknownRisk");
    }
  };

  const getRiskBadgeColor = (riskLevel: string) => {
    switch (normalizeRiskLevel(riskLevel)) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "veryHigh":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const sortedPredictions = useMemo(() => {
    return [...predictions].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [predictions]);

  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen flex flex-col bg-background"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <Header variant="dashboard" />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <Alert className="w-full max-w-md bg-yellow-50 border-yellow-200">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              {t("pastReportsPage.mustLogin")}
            </AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col bg-slate-50"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <Header variant="dashboard" />

      <main className="flex-1">
        <section className="border-b bg-background">
          <div className="container mx-auto px-4 py-8 md:py-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className={isArabic ? "text-right" : "text-left"}>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                  {t("pastReportsPage.title")}
                </h1>
                <p className="text-muted-foreground max-w-2xl">
                  {t("pastReportsPage.subtitle")}
                </p>
              </div>

              <Link to="/diagnosis">
                <Button size="lg" className="min-w-[180px]">
                  {t("pastReportsPage.newTest")}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {t("pastReportsPage.loading")}
                </p>
              </div>
            </div>
          )}

          {error && !isLoading && (
            <Alert className="bg-red-50 border-red-200 mb-6">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {!isLoading && !error && sortedPredictions.length === 0 && (
            <Card className="p-12 text-center border-dashed shadow-sm">
              <AlertTriangle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">
                {t("pastReportsPage.emptyTitle")}
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {t("pastReportsPage.emptySubtitle")}
              </p>
              <Link to="/diagnosis">
                <Button size="lg">{t("pastReportsPage.startAnalysis")}</Button>
              </Link>
            </Card>
          )}

          {!isLoading && !error && sortedPredictions.length > 0 && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="p-6 shadow-sm border-0 bg-background rounded-2xl">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      {t("pastReportsPage.totalReports")}
                    </p>
                    <p className="text-4xl font-bold text-primary">
                      {sortedPredictions.length}
                    </p>
                  </div>
                </Card>

                <Card className="p-6 shadow-sm border-0 bg-background rounded-2xl">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      {t("pastReportsPage.latestTest")}
                    </p>
                    <p className="text-xl font-semibold">
                      {new Date(sortedPredictions[0].created_at).toLocaleDateString(
                        isArabic ? "ar-SA" : "en-US"
                      )}
                    </p>
                  </div>
                </Card>

                <Card className="p-6 shadow-sm border-0 bg-background rounded-2xl">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      {t("pastReportsPage.average")}
                    </p>
                    <p className="text-4xl font-bold">
                      {(
                        sortedPredictions.reduce(
                          (sum, p) => sum + p.probability,
                          0
                        ) / sortedPredictions.length
                      ).toFixed(1)}
                      %
                    </p>
                  </div>
                </Card>
              </div>

              <div className="space-y-4">
                {sortedPredictions.map((pred) => (
                  <Card
                    key={pred.id}
                    className="p-6 rounded-2xl shadow-sm hover:shadow-md transition-all border bg-background"
                  >
                    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between mb-4">
                      <div
                        className={`flex-1 ${
                          isArabic ? "text-right" : "text-left"
                        }`}
                      >
                        <div
                          className={`flex flex-wrap items-center gap-3 mb-2 ${
                            isArabic ? "justify-end" : "justify-start"
                          }`}
                        >
                          <h3 className="text-lg font-bold">
                            {t("pastReportsPage.infectionProbability")}:{" "}
                            {pred.probability.toFixed(2)}%
                          </h3>
                          <Badge className={getRiskBadgeColor(pred.risk_level)}>
                            {getLocalizedRiskLabel(pred.risk_level)}
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground">
                          {t("pastReportsPage.date")}:{" "}
                          {new Date(pred.created_at).toLocaleDateString(
                            isArabic ? "ar-SA" : "en-US"
                          )}{" "}
                          {new Date(pred.created_at).toLocaleTimeString(
                            isArabic ? "ar-SA" : "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>

                      <Link
                        to="/report"
                        state={{
                          formData: {
                            pregnancies: pred.pregnancies,
                            glucose: pred.glucose,
                            bloodPressure: pred.blood_pressure,
                            skinThickness: pred.skin_thickness,
                            insulin: pred.insulin,
                            bmi: pred.bmi,
                            diabetesPedigreeFunction:
                              pred.diabetes_pedigree_function,
                            age: pred.age,
                          },
                          probability: pred.probability,
                          riskLevel: pred.risk_level,
                          message: pred.message,
                          predictionId: pred.id,
                        }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="min-w-[140px]"
                        >
                          {t("pastReportsPage.viewReport")}
                          <ArrowRight
                            className={`${
                              isArabic ? "ml-2 rotate-180" : "mr-2"
                            } h-4 w-4`}
                          />
                        </Button>
                      </Link>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4 pt-4 border-t">
                      <div className={isArabic ? "text-right" : "text-left"}>
                        <p className="text-xs text-muted-foreground mb-1">
                          {t("pastReportsPage.pregnancies")}
                        </p>
                        <p className="font-medium">{pred.pregnancies}</p>
                      </div>
                      <div className={isArabic ? "text-right" : "text-left"}>
                        <p className="text-xs text-muted-foreground mb-1">
                          {t("pastReportsPage.glucose")}
                        </p>
                        <p className="font-medium">{pred.glucose} mg/dL</p>
                      </div>
                      <div className={isArabic ? "text-right" : "text-left"}>
                        <p className="text-xs text-muted-foreground mb-1">
                          {t("pastReportsPage.bloodPressure")}
                        </p>
                        <p className="font-medium">
                          {pred.blood_pressure} mmHg
                        </p>
                      </div>
                      <div className={isArabic ? "text-right" : "text-left"}>
                        <p className="text-xs text-muted-foreground mb-1">
                          {t("pastReportsPage.bmi")}
                        </p>
                        <p className="font-medium">{pred.bmi}</p>
                      </div>
                    </div>

                    <div
                      className={`mt-4 pt-4 border-t ${
                        isArabic ? "text-right" : "text-left"
                      }`}
                    >
                      <p className="text-xs text-muted-foreground">
                        {t("pastReportsPage.reportId")}: #{pred.id}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}