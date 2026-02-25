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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Activity, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { API_ENDPOINTS } from "@/lib/api";

// ────────────────────────────────────────────────
// Schema التحقق (Zod)
const formSchema = z.object({
  pregnancies: z.coerce.number().min(0, "يجب أن يكون 0 أو أكثر").max(20, "الحد الأقصى 20"),
  glucose: z.coerce.number().min(0, "يجب أن يكون 0 أو أكثر").max(200, "الحد الأقصى 200 mg/dL"),
  bloodPressure: z.coerce.number().min(0, "يجب أن يكون 0 أو أكثر").max(155, "الحد الأقصى 155 mmHg"),
  skinThickness: z.coerce.number().min(0, "يجب أن يكون 0 أو أكثر").max(99, "الحد الأقصى 99 mm"),
  insulin: z.coerce.number().min(0, "يجب أن يكون 0 أو أكثر").max(846, "الحد الأقصى 846 mu U/ml"),
  bmi: z.coerce.number().min(0, "يجب أن يكون 0 أو أكثر").max(67.1, "الحد الأقصى 67.1"),
  diabetesPedigreeFunction: z.coerce
    .number()
    .min(0.078, "يجب أن يكون 0.078 أو أكثر")
    .max(2.42, "الحد الأقصى 2.42"),
  age: z.coerce.number().min(21, "يجب أن يكون 21 أو أكثر").max(81, "الحد الأقصى 81 سنة"),
});

type FormValues = z.infer<typeof formSchema>;

// ────────────────────────────────────────────────
export default function DiagnosisWizard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
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

  // ────────────────────────────────────────────────
  
const onSubmit = async (values: FormValues) => {
  setIsLoading(true);
  console.log("=== FORM SUBMITTED ===");
  console.log("Values:", values);

  try {
    // تحويل البيانات من camelCase إلى snake_case
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
    
    // مباشرة fetch بدون apiCall
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

    toast.success("✅ تم التحليل بنجاح!");

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
    toast.error("حدث خطأ: " + (error instanceof Error ? error.message : String(error)));
  } finally {
    setIsLoading(false);
  }
};
  // ────────────────────────────────────────────────
  return (
    <div className="container max-w-4xl py-12 px-4 mx-auto">
      <Card className="border-2 shadow-xl">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <Activity className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">كشف مبكر لمرض السكري</CardTitle>
          <CardDescription className="text-lg mt-2">
            أدخل بياناتك الطبية الأساسية وسيتم حساب احتمالية إصابتك في ثوانٍ
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* معلومات مهمة */}
              <Alert className="border-blue-500 bg-blue-50">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800 ml-2">
                  <strong>💡 ملاحظة مهمة:</strong> هذا التقييم أولي فقط ولا يغني عن استشارة طبيب متخصص.
                  في حالة القلق، يرجى مراجعة الطبيب فوراً.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* حقل 1 */}
                <FormField
                  control={form.control}
                  name="pregnancies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>عدد مرات الحمل</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} max={20} {...field} />
                      </FormControl>
                      <FormDescription>0 إذا لم يكن هناك حمل</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* حقل 2 */}
                <FormField
                  control={form.control}
                  name="glucose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>مستوى الجلوكوز (mg/dL)</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} max={200} {...field} />
                      </FormControl>
                      <FormDescription>عادةً 70-140 بعد الصيام</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* باقي الحقول (نفس الترتيب السابق) */}
                <FormField name="bloodPressure" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>ضغط الدم (mmHg)</FormLabel>
                    <FormControl><Input type="number" min={0} max={155} {...field} /></FormControl>
                    <FormDescription>الضغط الانقباضي</FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField name="skinThickness" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>سماكة الجلد (mm)</FormLabel>
                    <FormControl><Input type="number" min={0} max={99} {...field} /></FormControl>
                    <FormDescription>سمك الدهون تحت الجلد</FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField name="insulin" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>مستوى الإنسولين (mu U/ml)</FormLabel>
                    <FormControl><Input type="number" min={0} max={846} {...field} /></FormControl>
                    <FormDescription>0 إذا لم يُقاس</FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField name="bmi" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>مؤشر كتلة الجسم (BMI)</FormLabel>
                    <FormControl><Input type="number" step="0.1" min={0} max={67.1} {...field} /></FormControl>
                    <FormDescription>الوزن بالكيلو ÷ (الطول بالمتر)²</FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField name="diabetesPedigreeFunction" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>وظيفة نسبة السكري (Pedigree)</FormLabel>
                    <FormControl><Input type="number" step="0.001" min={0.078} max={2.42} {...field} /></FormControl>
                    <FormDescription>عامل وراثي (0.078–2.42)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField name="age" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>العمر (سنوات)</FormLabel>
                    <FormControl><Input type="number" min={21} max={81} {...field} /></FormControl>
                    <FormDescription>من 21 إلى 81 سنة</FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              {/* زر الإرسال */}
              <div className="flex justify-center pt-8">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading || !form.formState.isValid}
                  className="w-full max-w-md text-lg py-6"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      جاري الحساب...
                    </>
                  ) : (
                    "احسب احتمالية الإصابة "
                  )}
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground mt-4">
                هذا تقييم أولي فقط، لا يُغني عن استشارة طبيب متخصص.
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
