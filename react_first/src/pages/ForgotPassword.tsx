// src/pages/ForgotPassword.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { Loader2, ArrowLeft, Mail, CheckCircle } from "lucide-react";
import Header from "@/components/Shared/Header";
import Footer from "@/components/Shared/Footer";
import { toast } from "sonner";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log("📤 Sending password reset request for:", email);

      const response = await fetch("http://localhost:8000/api/auth/password-reset/", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      console.log("📥 Response:", data);

      if (!response.ok) {
        throw new Error(data.error || "فشل إرسال البريد الإلكتروني");
      }

      setIsSent(true);
      toast.success(data.message || "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني");
    } catch (err) {
      console.error("❌ Error:", err);
      const errorMessage = err instanceof Error ? err.message : "حدث خطأ في إرسال البريد. يرجى المحاولة مرة أخرى.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header variant="dashboard" />
      <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="w-full max-w-md p-6">
          {!isSent ? (
            <>
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold mb-2">نسيت كلمة المرور؟</h1>
                <p className="text-muted-foreground">
                  أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور
                </p>
              </div>

              {/* Back Button */}
              <Button
                variant="ghost"
                onClick={() => navigate("/auth")}
                className="mb-4 gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                عودة لتسجيل الدخول
              </Button>

              {/* Error */}
              {error && (
                <Alert className="bg-red-50 border-red-200 mb-4">
                  <p className="text-red-800">{error}</p>
                </Alert>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    className="text-left"
                    dir="ltr"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin ml-2" />
                      جاري الإرسال...
                    </>
                  ) : (
                    "إرسال رابط إعادة التعيين"
                  )}
                </Button>
              </form>
            </>
          ) : (
            /* Success Message */
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">تم الإرسال بنجاح!</h2>
              <p className="text-muted-foreground mb-6">
                تحقق من بريدك الإلكتروني واضغط على الرابط لإعادة تعيين كلمة المرور
              </p>
              <Button
                onClick={() => navigate("/auth")}
                className="w-full"
              >
                عودة لتسجيل الدخول
              </Button>
            </div>
          )}
        </Card>
      </main>
      <Footer />
    </div>
  );
}
