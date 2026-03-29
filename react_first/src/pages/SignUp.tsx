import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Mail, Lock, Chrome, Users } from "lucide-react";
import { FaApple } from "react-icons/fa";
import Header from "@/components/Shared/Header";
import Footer from "@/components/Shared/Footer";
import { useTranslation } from "react-i18next";

const SignUp = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sign up:", formData);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <Header variant="auth" />

      <main className="flex-1 flex items-center justify-center p-4 bg-background">
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
          {/* Sign Up Form */}
          <div className="bg-card rounded-2xl shadow-lg p-8">
            <div
              className={`flex items-center gap-3 mb-8 ${
                isArabic ? "justify-end" : "justify-start"
              }`}
            >
              <Activity className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">HealthAI</span>
            </div>

            <h2
              className={`text-3xl font-bold mb-6 ${
                isArabic ? "text-right" : "text-left"
              }`}
            >
              {t("signupPage.createAccount")}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">{t("signupPage.fullName")}</Label>
                <div className="relative">
                  <User
                    className={`absolute top-3 h-5 w-5 text-muted-foreground ${
                      isArabic ? "right-3" : "left-3"
                    }`}
                  />
                  <Input
                    id="fullName"
                    placeholder={t("signupPage.fullNamePlaceholder")}
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className={isArabic ? "pr-10 text-right" : "pl-10 text-left"}
                    dir={isArabic ? "rtl" : "ltr"}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t("signupPage.emailAddress")}</Label>
                <div className="relative">
                  <Mail
                    className={`absolute top-3 h-5 w-5 text-muted-foreground ${
                      isArabic ? "right-3" : "left-3"
                    }`}
                  />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("signupPage.emailPlaceholder")}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={isArabic ? "pr-10 text-left" : "pl-10 text-left"}
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">{t("signupPage.gender")}</Label>
                <div className="relative">
                  <Users
                    className={`absolute top-3 h-5 w-5 text-muted-foreground z-10 ${
                      isArabic ? "right-3" : "left-3"
                    }`}
                  />
                  <Select
                    value={formData.gender}
                    onValueChange={(value) =>
                      setFormData({ ...formData, gender: value })
                    }
                  >
                    <SelectTrigger
                      className={isArabic ? "pr-10 text-right" : "pl-10 text-left"}
                      dir={isArabic ? "rtl" : "ltr"}
                    >
                      <SelectValue placeholder={t("signupPage.genderPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">
                        {t("signupPage.male")}
                      </SelectItem>
                      <SelectItem value="female">
                        {t("signupPage.female")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t("signupPage.password")}</Label>
                <div className="relative">
                  <Lock
                    className={`absolute top-3 h-5 w-5 text-muted-foreground ${
                      isArabic ? "right-3" : "left-3"
                    }`}
                  />
                  <Input
                    id="password"
                    type="password"
                    placeholder={t("signupPage.passwordPlaceholder")}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className={isArabic ? "pr-10 text-right" : "pl-10 text-left"}
                    dir={isArabic ? "rtl" : "ltr"}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  {t("signupPage.confirmPassword")}
                </Label>
                <div className="relative">
                  <Lock
                    className={`absolute top-3 h-5 w-5 text-muted-foreground ${
                      isArabic ? "right-3" : "left-3"
                    }`}
                  />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder={t("signupPage.confirmPasswordPlaceholder")}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className={isArabic ? "pr-10 text-right" : "pl-10 text-left"}
                    dir={isArabic ? "rtl" : "ltr"}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                {t("signupPage.signUp")}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                {t("signupPage.alreadyHaveAccount")}{" "}
                <Link to="/login" className="text-primary hover:underline">
                  {t("signupPage.loginHere")}
                </Link>
              </p>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    {t("signupPage.or")}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" type="button" className="w-full">
                  <Chrome className={isArabic ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"} />
                  Google
                </Button>
                <Button variant="outline" type="button" className="w-full">
                  <FaApple className={isArabic ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"} />
                  Apple
                </Button>
              </div>
            </form>
          </div>

          {/* Info Section */}
          <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-primary to-cyan-600 rounded-2xl p-12 text-white">
            <div className="bg-cyan-500/30 rounded-lg p-8 mb-8 max-w-sm">
              <img
                src="./../../public/Doctoooorimg.png"
                alt="Doctor illustration"
                className="w-full h-auto"
              />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-center">
              {t("signupPage.sideTitle")}
            </h2>
            <p className="text-lg text-center opacity-90">
              {t("signupPage.sideSubtitle")}
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const Activity = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 12h4l3-9 4 18 3-9h4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SignUp;