// src/pages/PastReports.tsx
import { useEffect, useState } from "react";
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
          toast.info("لا توجد تقارير سابقة");
        }
      } catch (err) {
        console.error("❌ خطأ في جلب التقارير:", err);
        setError("لم نتمكن من جلب التقارير السابقة");
        toast.error("خطأ في جلب البيانات");
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && user) {
      fetchPredictions();
    }
  }, [isAuthenticated, user]);

  // دالة للحصول على لون Badge بناءً على مستوى المخاطر
  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case "منخفض":
        return "bg-green-100 text-green-800";
      case "متوسط":
        return "bg-yellow-100 text-yellow-800";
      case "مرتفع":
        return "bg-orange-100 text-orange-800";
      case "مرتفع جدًا":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header variant="dashboard" />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <Alert className="w-full max-w-md bg-yellow-50 border-yellow-200">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              يجب عليك تسجيل الدخول أولاً لعرض التقارير السابقة
            </AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header variant="dashboard" />
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">التقارير السابقة</h1>
              <p className="text-muted-foreground">
                عرض جميع تحاليل السكري السابقة التي أجريتها
              </p>
            </div>
            <Link to="/diagnosis">
              <Button size="lg">
                عمل فحص جديد
              </Button>
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">جاري تحميل التقارير...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <Alert className="bg-red-50 border-red-200">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Empty State */}
        {!isLoading && !error && predictions.length === 0 && (
          <Card className="p-12 text-center">
            <AlertTriangle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">لا توجد تقارير سابقة</h2>
            <p className="text-muted-foreground mb-6">
              قم بإجراء أول تحليل السكري لديك الآن
            </p>
            <Link to="/diagnosis">
              <Button size="lg">
                ابدأ التحليل
              </Button>
            </Link>
          </Card>
        )}

        {/* Reports Grid */}
        {!isLoading && !error && predictions.length > 0 && (
          <div>
            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <Card className="p-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">إجمالي التقارير</p>
                  <p className="text-4xl font-bold text-primary">{predictions.length}</p>
                </div>
              </Card>
              <Card className="p-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">أحدث فحص</p>
                  <p className="text-xl font-semibold">
                    {new Date(predictions[0].created_at).toLocaleDateString("ar-SA")}
                  </p>
                </div>
              </Card>
              <Card className="p-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">المتوسط</p>
                  <p className="text-4xl font-bold">
                    {(
                      predictions.reduce((sum, p) => sum + p.probability, 0) /
                      predictions.length
                    ).toFixed(1)}
                    %
                  </p>
                </div>
              </Card>
            </div>

            {/* Reports List */}
            <div className="space-y-4">
              {predictions.map((pred) => (
                <Card key={pred.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold">
                          احتمالية الإصابة: {pred.probability.toFixed(2)}%
                        </h3>
                        <Badge className={getRiskBadgeColor(pred.risk_level)}>
                          {pred.risk_level}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        التاريخ: {new Date(pred.created_at).toLocaleDateString("ar-SA")}{" "}
                        {new Date(pred.created_at).toLocaleTimeString("ar-SA", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
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
                          diabetesPedigreeFunction: pred.diabetes_pedigree_function,
                          age: pred.age,
                        },
                        probability: pred.probability,
                        riskLevel: pred.risk_level,
                        message: pred.message,
                        predictionId: pred.id,
                      }}
                    >
                      <Button variant="outline" size="sm">
                        عرض التقرير
                        <ArrowRight className="mr-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>

                  {/* Details Grid */}
                  <div className="grid md:grid-cols-4 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">عدد الحمل</p>
                      <p className="font-medium">{pred.pregnancies}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">الجلوكوز</p>
                      <p className="font-medium">{pred.glucose} mg/dL</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">ضغط الدم</p>
                      <p className="font-medium">{pred.blood_pressure} mmHg</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">مؤشر كتلة الجسم</p>
                      <p className="font-medium">{pred.bmi}</p>
                    </div>
                  </div>

                  {/* Report ID */}
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-muted-foreground">
                      رقم التقرير: #{pred.id}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
