import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Bell, FileText, Calendar, Download, Beaker, Plus } from "lucide-react";
import Header from "@/components/Shared/Header";
import Footer from "@/components/Shared/Footer";
import { toast } from "sonner";
import { FaUser } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { apiCall, API_ENDPOINTS } from "@/lib/api";

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

const Dashboard = () => {
  const { user } = useAuth();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setIsLoading(true);
        const data = await apiCall<{
          count: number;
          predictions: Prediction[];
        }>(API_ENDPOINTS.GET_PREDICTIONS, {
          method: "GET",
        });
        setPredictions(data.predictions || []);
      } catch (err) {
        console.error("❌ خطأ في جلب التحاليل:", err);
        setError("لم نتمكن من جلب التحاليل السابقة");
        toast.error("خطأ في جلب البيانات");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchPredictions();
    }
  }, [user]);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header variant="dashboard" />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-card rounded-2xl p-8 mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              أهلا بعودتك{user ? ` يا ${user.first_name || user.email}` : ""}!
            </h1>
            <p className="text-muted-foreground">
              صحتك، بقوة الذكاء الاصطناعي.
            </p>
          </div>
          <Link to="/diagnosis">
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              عمل فحص جديد
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-32 h-32 rounded-full mb-4 relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-primary to-cyan-600 rounded-full flex items-center justify-center overflow-hidden">
                    {user?.profile_picture ? (
                      <img
                        src={user.profile_picture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUser className="h-14 w-14 text-white" />
                    )}
                  </div>
                  <Link
                    to="/edit-profile"
                    className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors"
                  >
                    <svg
                      className="h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </Link>
                </div>
                <h3 className="text-xl font-bold">
                  {user ? `${user.first_name} ${user.last_name}` : "المستخدم"}
                </h3>
                <p className="text-sm text-muted-foreground">مستخدم HealthAI</p>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">معلومات الملف الشخصي</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">الاسم الأول</p>
                      <p className="font-medium">{user?.first_name || "-"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">الاسم الأخير</p>
                      <p className="font-medium">{user?.last_name || "-"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">البريد الإلكتروني</p>
                      <p className="font-medium">{user?.email || "-"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">رقم معرف المستخدم</p>
                      <p className="font-medium">#{user?.id || "-"}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-3">Health Preferences</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">AI Recommendations</p>
                      <p className="text-xs text-muted-foreground">
                        Enable personalized health tips
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <Link to="/edit-profile">
                  <Button variant="outline" className="w-full">
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Diagnoses */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">التحاليل الحديثة</h3>
              {isLoading ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">
                    جاري تحميل البيانات...
                  </p>
                </div>
              ) : error ? (
                <div className="text-center py-4">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : predictions.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-4">
                    لا توجد تحاليل سابقة
                  </p>
                  <Link to="/diagnosis">
                    <Button variant="default">عمل تحليل أول الحين</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {predictions.slice(0, 5).map((pred) => (
                    <div
                      key={pred.id}
                      className="flex items-center justify-between p-4 bg-accent/50 rounded-lg"
                    >
                      <div>
                        <h4 className="font-semibold">
                          احتمالية الإصابة: {pred.probability.toFixed(2)}%
                        </h4>
                        <div className="flex gap-2 mt-2">
                          <span className="text-xs px-2 py-1 bg-background rounded">
                            {pred.risk_level}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(pred.created_at).toLocaleDateString(
                              "ar-SA",
                            )}
                          </span>
                        </div>
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
                        <Button variant="link">عرض التقرير</Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* AI Recommendations */}
            <Card className="p-6 bg-primary/5 border-primary/20">
              <h3 className="text-xl font-bold mb-4">
                نصائح صحية من الذكاء الاصطناعي
              </h3>
              <div className="bg-card p-4 rounded-lg">
                <p className="text-primary font-semibold mb-2">نصيحة صحية:</p>
                <p className="text-muted-foreground">
                  حافظ على رطوبة جسدك، مارس الرياضة بانتظام، واحصل على قسط كافٍ
                  من النوم لصحة أفضل.
                </p>
              </div>
            </Card>

            {/* Quick Actions */}
            <div>
              <h3 className="text-xl font-bold mb-4">إجراءات سريعة</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <Link to="/diagnosis">
                  <Card className="p-6 text-center hover:bg-accent cursor-pointer transition-colors">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Beaker className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="font-semibold">فحص جديد</h4>
                  </Card>
                </Link>

                <Card
                  className="p-6 text-center hover:bg-accent cursor-pointer transition-colors"
                  onClick={() => {
                    if (predictions.length === 0) {
                      toast.info("لا توجد تقارير سابقة بعد");
                    }
                  }}
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Download className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold">التقارير السابقة</h4>
                  {predictions.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {predictions.length} تقرير
                    </p>
                  )}
                </Card>

                <Link to="/consultations">
                  <Card className="p-6 text-center hover:bg-accent cursor-pointer transition-colors">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="font-semibold">احجز استشارة</h4>
                  </Card>
                </Link>
              </div>
            </div>

            {/* Progress Tracker */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">متتبع التقدم</h3>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">الفحوصات المكتملة</span>
                  <span className="text-sm font-semibold text-primary">
                    {predictions.length} من{" "}
                    {Math.max(predictions.length + 1, 4)}
                  </span>
                </div>
                <Progress
                  value={Math.min((predictions.length / 4) * 100, 100)}
                  className="h-2"
                />
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
