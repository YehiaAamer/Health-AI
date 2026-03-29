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
import { useTranslation } from "react-i18next";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

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
        throw new Error(data.error || t("forgotPassword.errors.sendFailed"));
      }

      setIsSent(true);
      toast.success(
        data.message || t("forgotPassword.successToast")
      );
    } catch (err) {
      console.error("❌ Error:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : t("forgotPassword.errors.unexpected");
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-background"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <Header variant="dashboard" />

      <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="w-full max-w-md p-6 rounded-2xl shadow-sm">
          {!isSent ? (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-primary" />
                </div>

                <h1 className="text-2xl font-bold mb-2">
                  {t("forgotPassword.title")}
                </h1>

                <p className="text-muted-foreground">
                  {t("forgotPassword.subtitle")}
                </p>
              </div>

              <Button
                variant="ghost"
                onClick={() => navigate("/auth")}
                className="mb-4 gap-2"
              >
                <ArrowLeft className={isArabic ? "h-4 w-4 ml-1" : "h-4 w-4 mr-1"} />
                {t("forgotPassword.backToLogin")}
              </Button>

              {error && (
                <Alert className="bg-red-50 border-red-200 mb-4">
                  <p className="text-red-800">{error}</p>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t("forgotPassword.emailLabel")}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("forgotPassword.emailPlaceholder")}
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
                      <Loader2 className={isArabic ? "h-4 w-4 animate-spin ml-2" : "h-4 w-4 animate-spin mr-2"} />
                      {t("forgotPassword.sending")}
                    </>
                  ) : (
                    t("forgotPassword.submit")
                  )}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>

              <h2 className="text-2xl font-bold mb-2">
                {t("forgotPassword.sentTitle")}
              </h2>

              <p className="text-muted-foreground mb-6">
                {t("forgotPassword.sentSubtitle")}
              </p>

              <Button
                onClick={() => navigate("/auth")}
                className="w-full"
              >
                {t("forgotPassword.backToLogin")}
              </Button>
            </div>
          )}
        </Card>
      </main>

      <Footer />
    </div>
  );
}
