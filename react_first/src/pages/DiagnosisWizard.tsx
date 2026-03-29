// src/pages/DiagnosisWizard.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Loader2,
  Activity,
  ArrowLeft,
  ArrowRight,
  ShieldAlert,
  UserRound,
  HeartPulse,
  FlaskConical,
  Check,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { API_ENDPOINTS } from "@/lib/api";
import { useTranslation } from "react-i18next";
import Header from "@/components/Shared/Header";

// ────────────────────────────────────────────────
// Schema التحقق (Zod)
// ────────────────────────────────────────────────
const formSchema = z.object({
  pregnancies: z.coerce
    .number()
    .min(0, "يجب أن يكون 0 أو أكثر")
    .max(20, "الحد الأقصى 20"),
  glucose: z.coerce
    .number()
    .min(0, "يجب أن يكون 0 أو أكثر")
    .max(200, "الحد الأقصى 200 mg/dL"),
  bloodPressure: z.coerce
    .number()
    .min(0, "يجب أن يكون 0 أو أكثر")
    .max(155, "الحد الأقصى 155 mmHg"),
  skinThickness: z.coerce
    .number()
    .min(0, "يجب أن يكون 0 أو أكثر")
    .max(99, "الحد الأقصى 99 mm"),
  insulin: z.coerce
    .number()
    .min(0, "يجب أن يكون 0 أو أكثر")
    .max(846, "الحد الأقصى 846 mu U/ml"),
  bmi: z.coerce
    .number()
    .min(0, "يجب أن يكون 0 أو أكثر")
    .max(67.1, "الحد الأقصى 67.1"),
  diabetesPedigreeFunction: z.coerce
    .number()
    .min(0.078, "يجب أن يكون 0.078 أو أكثر")
    .max(2.42, "الحد الأقصى 2.42"),
  age: z.coerce
    .number()
    .min(21, "يجب أن يكون 21 أو أكثر")
    .max(81, "الحد الأقصى 81 سنة"),
});

type FormValues = z.infer<typeof formSchema>;
type StepKey = "basic" | "vitals" | "risk";

export default function DiagnosisWizard() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language.startsWith("ar");
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState<StepKey>("basic");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      pregnancies: 0,
      glucose: 85,
      bloodPressure: 70,
      skinThickness: 20,
      insulin: 0,
      bmi: 25.0,
      diabetesPedigreeFunction: 0.5,
      age: 35,
    },
  });

  const {
    trigger,
    formState: { isValid },
  } = form;

  const validateCurrentStep = async () => {
    if (activeStep === "basic") {
      return await trigger(["pregnancies", "age"]);
    }
    if (activeStep === "vitals") {
      return await trigger([
        "glucose",
        "bloodPressure",
        "skinThickness",
        "insulin",
        "bmi",
      ]);
    }
    if (activeStep === "risk") {
      return await trigger(["diabetesPedigreeFunction"]);
    }
    return false;
  };

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    console.log("=== FORM SUBMITTED ===");
    console.log("Values:", values);

    try {
      const backendData = {
        pregnancies: values.pregnancies,
        glucose: values.glucose,
        blood_pressure: values.bloodPressure,
        skin_thickness: values.skinThickness,
        insulin: values.insulin,
        bmi: values.bmi,
        diabetes_pedigree_function: values.diabetesPedigreeFunction,
        age: values.age,
      };

      console.log("Calling API:", API_ENDPOINTS.PREDICT);

      const response = await fetch(API_ENDPOINTS.PREDICT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(backendData),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || "فشل التحليل");
      }

      const result = await response.json();
      console.log("Result:", result);

      toast.success(t("diagnosisWizard.success"));

      setTimeout(() => {
        navigate("/report", {
          state: {
            formData: values,
            probability: result.probability,
            riskLevel: result.risk_level,
            message: result.message,
            predictionId: result.prediction_id,
          },
        });
      }, 100);
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        `${t("diagnosisWizard.error")}${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const steps: { key: StepKey; label: string }[] = [
    { key: "basic", label: t("diagnosisWizard.section1") },
    { key: "vitals", label: t("diagnosisWizard.section2") },
    { key: "risk", label: t("diagnosisWizard.section3") },
  ];

  const currentStepIndex = steps.findIndex((step) => step.key === activeStep);

  const goNext = async () => {
    const isStepValid = await validateCurrentStep();
    if (!isStepValid) return;

    if (activeStep === "basic") setActiveStep("vitals");
    else if (activeStep === "vitals") setActiveStep("risk");
  };

  const goPrevious = () => {
    if (activeStep === "risk") setActiveStep("vitals");
    else if (activeStep === "vitals") setActiveStep("basic");
  };

  const handleStepClick = async (targetStep: StepKey) => {
    const stepOrder: StepKey[] = ["basic", "vitals", "risk"];
    const targetIndex = stepOrder.indexOf(targetStep);
    const currentIndex = stepOrder.indexOf(activeStep);

    if (targetIndex <= currentIndex) {
      setActiveStep(targetStep);
      return;
    }

    const isStepValid = await validateCurrentStep();
    if (!isStepValid) return;

    if (targetIndex === currentIndex + 1) {
      setActiveStep(targetStep);
    }
  };

  const sectionTitleClass = isArabic ? "text-right" : "text-left";
  const fieldTextClass = isArabic ? "text-right" : "text-left";

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-background via-background to-accent/20"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <Header variant="dashboard" />

      <div className="container max-w-6xl py-10 px-4 mx-auto">
        <div className="mb-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/home")}
            className={`gap-2 rounded-xl border-primary/30 bg-primary/5 text-primary hover:bg-primary hover:text-primary-foreground ${
              isArabic ? "flex-row-reverse" : ""
            }`}
          >
            {isArabic ? (
              <ArrowRight className="h-4 w-4" />
            ) : (
              <ArrowLeft className="h-4 w-4" />
            )}
            {t("diagnosisWizard.backHome")}
          </Button>
        </div>

        <div className="mb-8">
          <div className={`mb-4 ${sectionTitleClass}`}>
            <h2 className="text-2xl font-bold tracking-tight mb-2">
              {t("diagnosisWizard.howItWorks")}
            </h2>
            <p className="text-muted-foreground leading-7">
              {t("diagnosisWizard.howItWorksDesc")}
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {[
              t("diagnosisWizard.tip1"),
              t("diagnosisWizard.tip2"),
              t("diagnosisWizard.tip3"),
            ].map((tip, index) => (
              <div
                key={index}
                className={`flex items-start gap-2 rounded-2xl border border-border/60 bg-background/60 p-4 backdrop-blur-sm ${
                  isArabic ? "flex-row-reverse text-right" : "text-left"
                }`}
              >
                <CheckCircle2 className="h-4 w-4 mt-1 text-emerald-600 shrink-0" />
                <p className="text-sm text-muted-foreground">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden bg-background/95 backdrop-blur">
          <CardHeader className="text-center pb-6 pt-8 px-6 bg-gradient-to-br from-background via-primary/5 to-accent/30 border-b">
            <div className="flex justify-center mb-5">
              <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center shadow-sm">
                <Activity className="h-10 w-10 text-primary" />
              </div>
            </div>

            <CardTitle className="text-3xl md:text-4xl font-bold tracking-tight">
              {t("diagnosisWizard.pageTitle")}
            </CardTitle>

            <CardDescription className="text-base md:text-lg mt-3 max-w-2xl mx-auto leading-7">
              {t("diagnosisWizard.pageSubtitle")}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-8 px-6 md:px-8 pb-8">
            <div className="mb-10">
              <div
                className={`flex items-start ${
                  isArabic ? "flex-row-reverse" : ""
                }`}
              >
                {steps.map((step, index) => {
                  const isCompleted = index < currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  const isLast = index === steps.length - 1;
                  const isClickable = index <= currentStepIndex + 1;

                  return (
                    <div
                      key={step.key}
                      className={`flex items-start ${
                        isLast ? "flex-none" : "flex-1"
                      } ${isArabic ? "flex-row-reverse" : ""}`}
                    >
                      <button
                        type="button"
                        onClick={() => handleStepClick(step.key)}
                        disabled={!isClickable}
                        className={`group flex flex-col items-center text-center transition-all ${
                          !isClickable
                            ? "cursor-not-allowed opacity-55"
                            : "cursor-pointer"
                        }`}
                      >
                        <div
                          className={`h-11 w-11 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                            isCompleted
                              ? "bg-primary border-primary text-primary-foreground"
                              : isCurrent
                              ? "border-primary bg-primary/10 text-primary shadow-md scale-105"
                              : "border-border bg-background text-muted-foreground"
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="h-5 w-5" />
                          ) : (
                            <span className="text-sm font-bold">{index + 1}</span>
                          )}
                        </div>

                        <div className="mt-3 max-w-[120px]">
                          <p
                            className={`text-sm font-medium leading-5 transition-colors ${
                              isCurrent || isCompleted
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            {step.label}
                          </p>
                        </div>
                      </button>

                      {!isLast && (
                        <div
                          className={`pt-5 ${
                            isArabic ? "pr-3 pl-3" : "pl-3 pr-3"
                          } flex-1`}
                        >
                          <div className="h-[3px] w-full rounded-full bg-border overflow-hidden">
                            <div
                              className={`h-full rounded-full bg-primary transition-all duration-700 ease-in-out ${
                                index < currentStepIndex ? "w-full" : "w-0"
                              }`}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="relative min-h-[320px]">
                  <div
                    className={`transition-all duration-500 ease-out ${
                      activeStep === "basic"
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-3 pointer-events-none hidden"
                    }`}
                  >
                    {activeStep === "basic" && (
                      <Card className="border border-border/70 shadow-sm rounded-2xl bg-card/40 animate-in fade-in-0 slide-in-from-bottom-3 duration-500">
                        <CardHeader className="pb-4">
                          <div
                            className={`flex items-center gap-2 ${
                              isArabic ? "flex-row-reverse" : ""
                            }`}
                          >
                            <UserRound className="h-5 w-5 text-primary" />
                            <div className={sectionTitleClass}>
                              <CardTitle className="text-xl">
                                {t("diagnosisWizard.section1")}
                              </CardTitle>
                              <CardDescription className="mt-1">
                                {t("diagnosisWizard.section1Desc")}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="pregnancies"
                              render={({ field }) => (
                                <FormItem className={fieldTextClass}>
                                  <FormLabel>
                                    {t("diagnosisWizard.pregnancies")}
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min={0}
                                      max={20}
                                      placeholder={t(
                                        "diagnosisWizard.pregnanciesPlaceholder"
                                      )}
                                      {...field}
                                      className="h-12 rounded-xl"
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    {t("diagnosisWizard.pregnanciesDesc")}
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="age"
                              render={({ field }) => (
                                <FormItem className={fieldTextClass}>
                                  <FormLabel>{t("diagnosisWizard.age")}</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min={21}
                                      max={81}
                                      placeholder={t(
                                        "diagnosisWizard.agePlaceholder"
                                      )}
                                      {...field}
                                      className="h-12 rounded-xl"
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    {t("diagnosisWizard.ageDesc")}
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  <div
                    className={`transition-all duration-500 ease-out ${
                      activeStep === "vitals"
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-3 pointer-events-none hidden"
                    }`}
                  >
                    {activeStep === "vitals" && (
                      <Card className="border border-border/70 shadow-sm rounded-2xl bg-card/40 animate-in fade-in-0 slide-in-from-bottom-3 duration-500">
                        <CardHeader className="pb-4">
                          <div
                            className={`flex items-center gap-2 ${
                              isArabic ? "flex-row-reverse" : ""
                            }`}
                          >
                            <HeartPulse className="h-5 w-5 text-primary" />
                            <div className={sectionTitleClass}>
                              <CardTitle className="text-xl">
                                {t("diagnosisWizard.section2")}
                              </CardTitle>
                              <CardDescription className="mt-1">
                                {t("diagnosisWizard.section2Desc")}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="glucose"
                              render={({ field }) => (
                                <FormItem className={fieldTextClass}>
                                  <FormLabel>
                                    {t("diagnosisWizard.glucose")}
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min={0}
                                      max={200}
                                      placeholder={t(
                                        "diagnosisWizard.glucosePlaceholder"
                                      )}
                                      {...field}
                                      className="h-12 rounded-xl"
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    {t("diagnosisWizard.glucoseDesc")}
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              name="bloodPressure"
                              control={form.control}
                              render={({ field }) => (
                                <FormItem className={fieldTextClass}>
                                  <FormLabel>
                                    {t("diagnosisWizard.bloodPressure")}
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min={0}
                                      max={155}
                                      placeholder={t(
                                        "diagnosisWizard.bloodPressurePlaceholder"
                                      )}
                                      {...field}
                                      className="h-12 rounded-xl"
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    {t("diagnosisWizard.bloodPressureDesc")}
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              name="skinThickness"
                              control={form.control}
                              render={({ field }) => (
                                <FormItem className={fieldTextClass}>
                                  <FormLabel>
                                    {t("diagnosisWizard.skinThickness")}
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min={0}
                                      max={99}
                                      placeholder={t(
                                        "diagnosisWizard.skinThicknessPlaceholder"
                                      )}
                                      {...field}
                                      className="h-12 rounded-xl"
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    {t("diagnosisWizard.skinThicknessDesc")}
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              name="insulin"
                              control={form.control}
                              render={({ field }) => (
                                <FormItem className={fieldTextClass}>
                                  <FormLabel>
                                    {t("diagnosisWizard.insulin")}
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min={0}
                                      max={846}
                                      placeholder={t(
                                        "diagnosisWizard.insulinPlaceholder"
                                      )}
                                      {...field}
                                      className="h-12 rounded-xl"
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    {t("diagnosisWizard.insulinDesc")}
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              name="bmi"
                              control={form.control}
                              render={({ field }) => (
                                <FormItem className={fieldTextClass}>
                                  <FormLabel>{t("diagnosisWizard.bmi")}</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      step="0.1"
                                      min={0}
                                      max={67.1}
                                      placeholder={t(
                                        "diagnosisWizard.bmiPlaceholder"
                                      )}
                                      {...field}
                                      className="h-12 rounded-xl"
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    {t("diagnosisWizard.bmiDesc")}
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  <div
                    className={`transition-all duration-500 ease-out ${
                      activeStep === "risk"
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-3 pointer-events-none hidden"
                    }`}
                  >
                    {activeStep === "risk" && (
                      <Card className="border border-border/70 shadow-sm rounded-2xl bg-card/40 animate-in fade-in-0 slide-in-from-bottom-3 duration-500">
                        <CardHeader className="pb-4">
                          <div
                            className={`flex items-center gap-2 ${
                              isArabic ? "flex-row-reverse" : ""
                            }`}
                          >
                            <FlaskConical className="h-5 w-5 text-primary" />
                            <div className={sectionTitleClass}>
                              <CardTitle className="text-xl">
                                {t("diagnosisWizard.section3")}
                              </CardTitle>
                              <CardDescription className="mt-1">
                                {t("diagnosisWizard.section3Desc")}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              name="diabetesPedigreeFunction"
                              control={form.control}
                              render={({ field }) => (
                                <FormItem className={fieldTextClass}>
                                  <FormLabel>
                                    {t("diagnosisWizard.pedigree")}
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      step="0.001"
                                      min={0.078}
                                      max={2.42}
                                      placeholder={t(
                                        "diagnosisWizard.pedigreePlaceholder"
                                      )}
                                      {...field}
                                      className="h-12 rounded-xl"
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    {t("diagnosisWizard.pedigreeDesc")}
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between pt-2">
                  <div className="flex gap-3">
                    {activeStep !== "basic" && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={goPrevious}
                        className={isArabic ? "flex-row-reverse" : ""}
                      >
                        {isArabic ? (
                          <ArrowRight className="ml-2 h-4 w-4" />
                        ) : (
                          <ArrowLeft className="mr-2 h-4 w-4" />
                        )}
                        {t("diagnosisWizard.previous")}
                      </Button>
                    )}

                    {activeStep !== "risk" && (
                      <Button
                        type="button"
                        onClick={goNext}
                        className={isArabic ? "flex-row-reverse" : ""}
                      >
                        {t("diagnosisWizard.next")}
                        {isArabic ? (
                          <ArrowLeft className="mr-2 h-4 w-4" />
                        ) : (
                          <ArrowRight className="ml-2 h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>

                  {activeStep === "risk" && (
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isLoading || !isValid}
                      className="w-full md:w-auto md:min-w-[320px] text-lg py-6 rounded-2xl shadow-lg"
                    >
                      {isLoading ? (
                        <>
                          <Loader2
                            className={`${
                              isArabic ? "ml-2" : "mr-2"
                            } h-5 w-5 animate-spin`}
                          />
                          {t("diagnosisWizard.loading")}
                        </>
                      ) : (
                        t("diagnosisWizard.submit")
                      )}
                    </Button>
                  )}
                </div>

                <div
                  className={`flex items-center justify-center gap-2 text-sm mt-2 ${
                    isArabic ? "flex-row-reverse" : ""
                  }`}
                >
                  <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0" />
                  <p className="text-center text-amber-700 leading-6 font-medium">
                    {t("diagnosisWizard.footer")}
                  </p>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}