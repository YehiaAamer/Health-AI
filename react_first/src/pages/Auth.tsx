// src/pages/Auth.tsx - Enhanced Authentication Page
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Lock, User, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Shared/Header";
import Footer from "@/components/Shared/Footer";
import { ErrorDisplay } from "@/components/ErrorDisplay";

// ═══════════════════════════════════════════════════════════════
// Validation Schemas (Zod)
// ═══════════════════════════════════════════════════════════════
const loginSchema = z.object({
  email: z
    .string()
    .email("البريد الإلكتروني غير صحيح")
    .min(1, "البريد الإلكتروني مطلوب"),
  password: z
    .string()
    .min(1, "كلمة المرور مطلوبة"),
});

const signupSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "الاسم الأول يجب أن يكون حرفين على الأقل"),
    lastName: z
      .string()
      .min(2, "الاسم الأخير يجب أن يكون حرفين على الأقل"),
    email: z
      .string()
      .email("البريد الإلكتروني غير صحيح")
      .min(1, "البريد الإلكتروني مطلوب"),
    password: z
      .string()
      .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
      .regex(/[A-Z]/, "يجب أن تحتوي على حرف كبير")
      .regex(/[a-z]/, "يجب أن تحتوي على حرف صغير")
      .regex(/[0-9]/, "يجب أن تحتوي على رقم"),
    confirmPassword: z
      .string()
      .min(1, "تأكيد كلمة المرور مطلوب"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
  });

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

// ═══════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════
export default function Auth() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeTab = searchParams.get("tab") || "login";

  const { login, register, isLoading, error, clearError } = useAuth();
  const [localError, setLocalError] = useState<string | null>(null);

  // ─────────────────────────────────────────────
  // Login Form
  // ─────────────────────────────────────────────
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
      toast.success("✅ تم تسجيل الدخول بنجاح!");
      navigate("/dashboard");
    } catch (error: any) {
      const message = error.message || "فشل تسجيل الدخول";
      setLocalError(message);
      toast.error(message);
    }
  };

  // ─────────────────────────────────────────────
  // Signup Form
  // ─────────────────────────────────────────────
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
      await register(values.email, values.password, values.firstName, values.lastName);
      toast.success("✅ تم إنشاء الحساب بنجاح!");
      navigate("/dashboard");
    } catch (error: any) {
      const message = error.message || "فشل إنشاء الحساب";
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
    <div className="min-h-screen flex flex-col bg-background">
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
              <CardTitle className="text-2xl font-bold">الدخول الآمن</CardTitle>
              <CardDescription>
                {activeTab === "login"
                  ? "سجل الدخول إلى حسابك"
                  : "أنشئ حساب جديد"}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              {/* Global Error Display */}
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
                  <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
                  <TabsTrigger value="signup">إنشاء حساب</TabsTrigger>
                </TabsList>

                {/* ═══════════════════════════════════════════ */}
                {/* Login Tab */}
                {/* ═══════════════════════════════════════════ */}
                <TabsContent value="login" className="space-y-4 mt-6">
                  <Form {...loginForm}>
                    <form
                      onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                      className="space-y-4"
                    >
                      {/* Email */}
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>البريد الإلكتروني</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="email"
                                  placeholder="your@email.com"
                                  className="pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Password */}
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>كلمة المرور</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="password"
                                  placeholder="••••••••"
                                  className="pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                        size="lg"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            جاري المعالجة...
                          </>
                        ) : (
                          "تسجيل الدخول"
                        )}
                      </Button>
                    </form>
                  </Form>

                  {/* Additional Links */}
                  <div className="text-center text-sm text-muted-foreground">
                    <p>
                      لا تملك حساباً؟{" "}
                      <button
                        onClick={() => handleTabChange("signup")}
                        className="text-primary hover:underline font-semibold"
                      >
                        أنشئ واحداً الآن
                      </button>
                    </p>
                  </div>
                </TabsContent>

                {/* ═══════════════════════════════════════════ */}
                {/* Signup Tab */}
                {/* ═══════════════════════════════════════════ */}
                <TabsContent value="signup" className="space-y-4 mt-6">
                  <Form {...signupForm}>
                    <form
                      onSubmit={signupForm.handleSubmit(onSignupSubmit)}
                      className="space-y-4"
                    >
                      {/* First Name */}
                      <FormField
                        control={signupForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الاسم الأول</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  placeholder="أحمد"
                                  className="pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Last Name */}
                      <FormField
                        control={signupForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الاسم الأخير</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  placeholder="محمد"
                                  className="pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Email */}
                      <FormField
                        control={signupForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>البريد الإلكتروني</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="email"
                                  placeholder="your@email.com"
                                  className="pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Password */}
                      <FormField
                        control={signupForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>كلمة المرور</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="password"
                                  placeholder="••••••••"
                                  className="pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormDescription className="text-xs">
                              حرف كبير، حرف صغير، رقم، 8+ أحرف
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Confirm Password */}
                      <FormField
                        control={signupForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>تأكيد كلمة المرور</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="password"
                                  placeholder="••••••••"
                                  className="pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                        size="lg"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            جاري المعالجة...
                          </>
                        ) : (
                          "إنشاء الحساب"
                        )}
                      </Button>
                    </form>
                  </Form>

                  {/* Additional Links */}
                  <div className="text-center text-sm text-muted-foreground">
                    <p>
                      لديك فعلاً حساب؟{" "}
                      <button
                        onClick={() => handleTabChange("login")}
                        className="text-primary hover:underline font-semibold"
                      >
                        سجل دخول الآن
                      </button>
                    </p>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Security Notice */}
              <Alert className="mt-6 border-blue-500 bg-blue-50">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800 text-sm mr-2">
                  🔒 بيانات آمنة: نستخدم التشفير لحماية بيانات تسجيل الدخول الخاصة بك
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Decorative Info */}
          <div className="text-center mt-6 text-sm text-muted-foreground">
            <p>
              هذا الموقع يستخدم الذكاء الاصطناعي للكشف المبكر عن مرض السكري
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
