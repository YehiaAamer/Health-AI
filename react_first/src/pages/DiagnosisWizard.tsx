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
} from "lucide-react";
import { toast } from "sonner";
import { apiCall, API_ENDPOINTS } from "@/lib/api";
import { useTranslation } from "react-i18next";
import Header from "@/components/Shared/Header";

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

const DESKTOP_HEADER_HEIGHT = 72;

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
      console.log("Payload:", backendData);

      const result = await apiCall<{
        probability: number;
        risk_level: string;
        message: string;
        prediction_id?: number;
      }>(API_ENDPOINTS.PREDICT, {
        method: "POST",
        body: JSON.stringify(backendData),
      });

      console.log("Result:", result);

      toast.success(t("diagnosisWizard.success"));

      navigate("/report", {
        state: {
          formData: values,
          probability: result.probability,
          riskLevel: result.risk_level,
          message: result.message,
          predictionId: result.prediction_id,
        },
      });
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

      <div
        className="container max-w-4xl px-4 mx-auto"
        style={{
          paddingTop: `${DESKTOP_HEADER_HEIGHT + 12}px`,
          paddingBottom: "24px",
        }}
      >
        <Card className="border-0 shadow-xl rounded-2xl overflow-hidden bg-background/95 backdrop-blur">
          <CardHeader className="text-center pb-4 pt-5 px-5 bg-gradient-to-br from-background via-primary/5 to-accent/30 border-b">
            <div className="flex justify-center mb-3">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shadow-sm">
                <Activity className="h-7 w-7 text-primary" />
              </div>
            </div>

            <CardTitle className="text-2xl md:text-3xl font-bold tracking-tight">
              {t("diagnosisWizard.pageTitle")}
            </CardTitle>

            <CardDescription className="text-sm md:text-base mt-2 max-w-xl mx-auto leading-6">
              {t("diagnosisWizard.pageSubtitle")}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-5 px-4 md:px-6 pb-6">
            <div className="mb-6">
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
                          className={`h-9 w-9 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                            isCompleted
                              ? "bg-primary border-primary text-primary-foreground"
                              : isCurrent
                              ? "border-primary bg-primary/10 text-primary shadow-sm scale-105"
                              : "border-border bg-background text-muted-foreground"
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <span className="text-xs font-bold">
                              {index + 1}
                            </span>
                          )}
                        </div>

                        <div className="mt-2 max-w-[100px]">
                          <p
                            className={`text-xs font-medium leading-4 transition-colors ${
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
                          className={`pt-4 ${
                            isArabic ? "pr-2 pl-2" : "pl-2 pr-2"
                          } flex-1`}
                        >
                          <div className="h-[2px] w-full rounded-full bg-border overflow-hidden">
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
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="relative min-h-[230px]">
                  <div
                    className={`transition-all duration-500 ease-out ${
                      activeStep === "basic"
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-3 pointer-events-none hidden"
                    }`}
                  >
                    {activeStep === "basic" && (
                      <Card className="border border-border/70 shadow-sm rounded-xl bg-card/40 animate-in fade-in-0 slide-in-from-bottom-3 duration-500">
                        <CardHeader className="pb-3 px-4 pt-4">
                          <div
                            className={`flex items-center gap-2 ${
                              isArabic ? "flex-row-reverse" : ""
                            }`}
                          >
                            <UserRound className="h-4 w-4 text-primary" />
                            <div className={sectionTitleClass}>
                              <CardTitle className="text-lg">
                                {t("diagnosisWizard.section1")}
                              </CardTitle>
                              <CardDescription className="mt-1 text-sm">
                                {t("diagnosisWizard.section1Desc")}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="px-4 pb-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                      className="h-10 rounded-lg"
                                    />
                                  </FormControl>
                                  <FormDescription className="text-xs">
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
                                  <FormLabel>
                                    {t("diagnosisWizard.age")}
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min={21}
                                      max={81}
                                      placeholder={t(
                                        "diagnosisWizard.agePlaceholder"
                                      )}
                                      {...field}
                                      className="h-10 rounded-lg"
                                    />
                                  </FormControl>
                                  <FormDescription className="text-xs">
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
                      <Card className="border border-border/70 shadow-sm rounded-xl bg-card/40 animate-in fade-in-0 slide-in-from-bottom-3 duration-500">
                        <CardHeader className="pb-3 px-4 pt-4">
                          <div
                            className={`flex items-center gap-2 ${
                              isArabic ? "flex-row-reverse" : ""
                            }`}
                          >
                            <HeartPulse className="h-4 w-4 text-primary" />
                            <div className={sectionTitleClass}>
                              <CardTitle className="text-lg">
                                {t("diagnosisWizard.section2")}
                              </CardTitle>
                              <CardDescription className="mt-1 text-sm">
                                {t("diagnosisWizard.section2Desc")}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="px-4 pb-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                      className="h-10 rounded-lg"
                                    />
                                  </FormControl>
                                  <FormDescription className="text-xs">
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
                                      className="h-10 rounded-lg"
                                    />
                                  </FormControl>
                                  <FormDescription className="text-xs">
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
                                      className="h-10 rounded-lg"
                                    />
                                  </FormControl>
                                  <FormDescription className="text-xs">
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
                                      className="h-10 rounded-lg"
                                    />
                                  </FormControl>
                                  <FormDescription className="text-xs">
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
                                  <FormLabel>
                                    {t("diagnosisWizard.bmi")}
                                  </FormLabel>
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
                                      className="h-10 rounded-lg"
                                    />
                                  </FormControl>
                                  <FormDescription className="text-xs">
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
                      <Card className="border border-border/70 shadow-sm rounded-xl bg-card/40 animate-in fade-in-0 slide-in-from-bottom-3 duration-500">
                        <CardHeader className="pb-3 px-4 pt-4">
                          <div
                            className={`flex items-center gap-2 ${
                              isArabic ? "flex-row-reverse" : ""
                            }`}
                          >
                            <FlaskConical className="h-4 w-4 text-primary" />
                            <div className={sectionTitleClass}>
                              <CardTitle className="text-lg">
                                {t("diagnosisWizard.section3")}
                              </CardTitle>
                              <CardDescription className="mt-1 text-sm">
                                {t("diagnosisWizard.section3Desc")}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="px-4 pb-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                      className="h-10 rounded-lg"
                                    />
                                  </FormControl>
                                  <FormDescription className="text-xs">
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

                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between pt-1">
                  <div className="flex gap-2">
                    {activeStep !== "basic" && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={goPrevious}
                        className={`h-9 px-4 text-sm rounded-lg ${
                          isArabic ? "flex-row-reverse" : ""
                        }`}
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
                        className={`h-9 px-5 text-sm rounded-lg ${
                          isArabic ? "flex-row-reverse" : ""
                        }`}
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
                      className="w-full md:w-auto md:min-w-[250px] text-base py-5 rounded-xl shadow-md"
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
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}