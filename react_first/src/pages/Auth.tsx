// src/pages/Auth.tsx
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Lock, User, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Shared/Header";
import Footer from "@/components/Shared/Footer";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { useTranslation } from "react-i18next";

export default function Auth() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const loginSchema = z.object({
    email: z
      .string()
      .email(t("authPage.validation.invalidEmail"))
      .min(1, t("authPage.validation.emailRequired")),
    password: z.string().min(1, t("authPage.validation.passwordRequired")),
  });

  const signupSchema = z
    .object({
      firstName: z
        .string()
        .min(2, t("authPage.validation.firstNameMin")),
      lastName: z
        .string()
        .min(2, t("authPage.validation.lastNameMin")),
      email: z
        .string()
        .email(t("authPage.validation.invalidEmail"))
        .min(1, t("authPage.validation.emailRequired")),
      password: z
        .string()
        .min(8, t("authPage.validation.passwordMin"))
        .regex(/[A-Z]/, t("authPage.validation.passwordUpper"))
        .regex(/[a-z]/, t("authPage.validation.passwordLower"))
        .regex(/[0-9]/, t("authPage.validation.passwordNumber")),
      confirmPassword: z
        .string()
        .min(1, t("authPage.validation.confirmPasswordRequired")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("authPage.validation.passwordsMismatch"),
      path: ["confirmPassword"],
    });

  type LoginFormValues = z.infer<typeof loginSchema>;
  type SignupFormValues = z.infer<typeof signupSchema>;

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeTab = searchParams.get("tab") || "login";

  const { login, register, isLoading, error, clearError } = useAuth();
  const [localError, setLocalError] = useState<string | null>(null);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onLoginSubmit = async (values: LoginFormValues) => {
    setLocalError(null);
    try {
      await login(values.email, values.password);
      toast.success(t("authPage.loginSuccess"));
      navigate("/dashboard");
    } catch (error: any) {
      const message = error.message || t("authPage.loginFailed");
      setLocalError(message);
      toast.error(message);
    }
  };

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSignupSubmit = async (values: SignupFormValues) => {
    setLocalError(null);
    try {
      await register(
        values.email,
        values.password,
        values.firstName,
        values.lastName,
      );
      toast.success(t("authPage.signupSuccess"));
      navigate("/dashboard");
    } catch (error: any) {
      const message = error.message || t("authPage.signupFailed");
      setLocalError(message);
      toast.error(message);
    }
  };

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
    setLocalError(null);
    clearError();
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-background"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <Header variant="default" />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card className="border-2 shadow-xl">
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Lock className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">
                {t("authPage.secureAccess")}
              </CardTitle>
              <CardDescription>
                {activeTab === "login"
                  ? t("authPage.loginSubtitle")
                  : t("authPage.signupSubtitle")}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              {(localError || error) && (
                <div className="mb-6">
                  <ErrorDisplay
                    error={localError || error}
                    onDismiss={() => {
                      setLocalError(null);
                      clearError();
                    }}
                  />
                </div>
              )}

              <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">
                    {t("authPage.loginTab")}
                  </TabsTrigger>
                  <TabsTrigger value="signup">
                    {t("authPage.signupTab")}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4 mt-6">
                  <Form {...loginForm}>
                    <form
                      onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("authPage.email")}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail
                                  className={`absolute top-3 h-4 w-4 text-muted-foreground ${
                                    isArabic ? "right-3" : "left-3"
                                  }`}
                                />
                                <Input
                                  type="email"
                                  placeholder="your@email.com"
                                  className={
                                    isArabic ? "pr-10 text-left" : "pl-10 text-left"
                                  }
                                  dir="ltr"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("authPage.password")}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock
                                  className={`absolute top-3 h-4 w-4 text-muted-foreground ${
                                    isArabic ? "right-3" : "left-3"
                                  }`}
                                />
                                <Input
                                  type="password"
                                  placeholder="••••••••"
                                  className={
                                    isArabic ? "pr-10 text-left" : "pl-10 text-left"
                                  }
                                  dir="ltr"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                        size="lg"
                      >
                        {isLoading ? (
                          <>
                            <Loader2
                              className={`h-4 w-4 animate-spin ${
                                isArabic ? "ml-2" : "mr-2"
                              }`}
                            />
                            {t("authPage.processing")}
                          </>
                        ) : (
                          t("authPage.loginButton")
                        )}
                      </Button>
                    </form>
                  </Form>

                  <div className="text-center text-sm text-muted-foreground">
                    <p>
                      {t("authPage.noAccount")}{" "}
                      <button
                        onClick={() => handleTabChange("signup")}
                        className="text-primary hover:underline font-semibold"
                      >
                        {t("authPage.createNow")}
                      </button>
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4 mt-6">
                  <Form {...signupForm}>
                    <form
                      onSubmit={signupForm.handleSubmit(onSignupSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={signupForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("authPage.firstName")}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User
                                  className={`absolute top-3 h-4 w-4 text-muted-foreground ${
                                    isArabic ? "right-3" : "left-3"
                                  }`}
                                />
                                <Input
                                  placeholder={t("authPage.firstNamePlaceholder")}
                                  className={
                                    isArabic ? "pr-10 text-right" : "pl-10 text-left"
                                  }
                                  dir={isArabic ? "rtl" : "ltr"}
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={signupForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("authPage.lastName")}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User
                                  className={`absolute top-3 h-4 w-4 text-muted-foreground ${
                                    isArabic ? "right-3" : "left-3"
                                  }`}
                                />
                                <Input
                                  placeholder={t("authPage.lastNamePlaceholder")}
                                  className={
                                    isArabic ? "pr-10 text-right" : "pl-10 text-left"
                                  }
                                  dir={isArabic ? "rtl" : "ltr"}
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={signupForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("authPage.email")}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail
                                  className={`absolute top-3 h-4 w-4 text-muted-foreground ${
                                    isArabic ? "right-3" : "left-3"
                                  }`}
                                />
                                <Input
                                  type="email"
                                  placeholder="your@email.com"
                                  className={
                                    isArabic ? "pr-10 text-left" : "pl-10 text-left"
                                  }
                                  dir="ltr"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={signupForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("authPage.password")}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock
                                  className={`absolute top-3 h-4 w-4 text-muted-foreground ${
                                    isArabic ? "right-3" : "left-3"
                                  }`}
                                />
                                <Input
                                  type="password"
                                  placeholder="••••••••"
                                  className={
                                    isArabic ? "pr-10 text-left" : "pl-10 text-left"
                                  }
                                  dir="ltr"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormDescription className="text-xs">
                              {t("authPage.passwordHint")}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={signupForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("authPage.confirmPassword")}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock
                                  className={`absolute top-3 h-4 w-4 text-muted-foreground ${
                                    isArabic ? "right-3" : "left-3"
                                  }`}
                                />
                                <Input
                                  type="password"
                                  placeholder="••••••••"
                                  className={
                                    isArabic ? "pr-10 text-left" : "pl-10 text-left"
                                  }
                                  dir="ltr"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                        size="lg"
                      >
                        {isLoading ? (
                          <>
                            <Loader2
                              className={`h-4 w-4 animate-spin ${
                                isArabic ? "ml-2" : "mr-2"
                              }`}
                            />
                            {t("authPage.processing")}
                          </>
                        ) : (
                          t("authPage.signupButton")
                        )}
                      </Button>
                    </form>
                  </Form>

                  <div className="text-center text-sm text-muted-foreground">
                    <p>
                      {t("authPage.haveAccount")}{" "}
                      <button
                        onClick={() => handleTabChange("login")}
                        className="text-primary hover:underline font-semibold"
                      >
                        {t("authPage.loginNow")}
                      </button>
                    </p>
                  </div>
                </TabsContent>
              </Tabs>

              <Alert className="mt-6 border-blue-500 bg-blue-50">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800 text-sm mr-2">
                  {t("authPage.securityNotice")}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <div className="text-center mt-6 text-sm text-muted-foreground">
            <p>{t("authPage.footerNote")}</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}