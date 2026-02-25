// src/pages/Report.tsx
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, ArrowLeft, Download } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Header from "@/components/Shared/Header";
import Footer from "@/components/Shared/Footer";
// تعريف النوع الموسّع
interface ExtendedjsPDF extends jsPDF {
  lastAutoTable?: {
    finalY: number;
  };
}
export default function Report() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state || {};

  // إذا ما كانت هناك نتيجة، ركز للـ diagnosis page
  useEffect(() => {
    if (!result.probability) {
      const timer = setTimeout(() => {
        navigate("/diagnosis", { replace: true });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [result.probability, navigate]);

  // إذا كانت النتيجة ناقصة، عرّض رسالة تحميل
  if (!result.probability) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header variant="dashboard" />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">لا توجد نتيجة تحليل</h2>
              <p className="text-muted-foreground mb-4">
                يرجى إجراء التحليل من صفحة الكشف أولاً...
              </p>
              <Link to="/diagnosis">
                <Button className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  العودة للكشف
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const probability = result.probability ?? 0;
  const riskLevel = result.riskLevel ?? "Unknown";
  const message = result.message ?? "";
  const formData = result.formData || {};

  const riskColor =
    probability > 70 ? "#ef4444" :
    probability > 50 ? "#f97316" :
    probability > 20 ? "#eab308" :
    "#22c55e";

  const pieData = [
    { name: "Diabetes Risk", value: probability },
    { name: "Remaining", value: 100 - probability },
  ];

  // Simple recommendations in English
  const recommendations = probability > 70 ? [
    "Consult an endocrinologist immediately for further tests",
    "Reduce sugars and refined carbs completely",
    "Start daily light to moderate exercise",
    "Monitor blood sugar levels regularly"
  ] : probability > 50 ? [
    "See a doctor as soon as possible",
    "Follow a low-carb diet",
    "Exercise at least 150 minutes per week",
    "Maintain a healthy weight"
  ] : probability > 20 ? [
    "Maintain a balanced and healthy lifestyle",
    "Avoid excess sugars",
    "Exercise regularly",
    "Get periodic check-ups every 6–12 months"
  ] : [
    "Continue your healthy lifestyle",
    "Eat vegetables, fruits, and good protein sources",
    "Exercise daily",
    "Periodic check-up every 1–2 years"
  ];

  const downloadPDF = () => {
    console.log("Starting PDF download...");

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Title
      doc.setFontSize(20);
      doc.text("Diabetes Risk Analysis Report", 105, 20, { align: "center" });

      // Date
      doc.setFontSize(12);
      doc.text(`Analysis Date: ${new Date().toLocaleDateString("en-US")}`, 105, 30, { align: "center" });

      // Probability
      doc.setFontSize(40);
      doc.setTextColor(riskColor.replace("#", ""));
      doc.text(`${probability.toFixed(4)}%`, 105, 60, { align: "center" });
      doc.setFontSize(16);
      doc.setTextColor(0);
      doc.text("Diabetes Risk Probability", 105, 75, { align: "center" });

      // Risk Level
      doc.setFontSize(16);
      doc.text(`Risk Level: ${riskLevel}`, 105, 90, { align: "center" });

      // Message
      doc.setFontSize(14);
      doc.text(message, 20, 110, { maxWidth: 170, align: "left" });

      // Input Data Table
      const tableData = Object.entries(formData).map(([key, value]) => {
        const label = 
          key === "pregnancies" ? "Pregnancies" :
          key === "glucose" ? "Glucose (mg/dL)" :
          key === "bloodPressure" ? "Blood Pressure (mmHg)" :
          key === "skinThickness" ? "Skin Thickness (mm)" :
          key === "insulin" ? "Insulin (mu U/ml)" :
          key === "bmi" ? "BMI" :
          key === "diabetesPedigreeFunction" ? "Diabetes Pedigree Function" :
          key === "age" ? "Age (years)" : key;

        return [label, value];
      });

      autoTable(doc, {
        startY: 130,
        head: [["Parameter", "Value"]],
        body: tableData,
        theme: "grid",
        styles: { fontSize: 12, cellPadding: 5, halign: "left" },
        headStyles: { fillColor: [66, 139, 202], textColor: 255 },
        alternateRowStyles: { fillColor: [240, 240, 240] },
      });

      // Recommendations
const finalY = (doc as ExtendedjsPDF).lastAutoTable?.finalY || 130;      recommendations.forEach((rec, i) => {
        doc.text(`• ${rec}`, 25, finalY + 30 + i * 8);
      });

      // Disclaimer
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(
        "Note: This is a preliminary report only and is not a final medical diagnosis. Please consult a specialist doctor for accurate evaluation and additional tests.",
        20, doc.internal.pageSize.height - 30, { maxWidth: 170 }
      );

      doc.save(`Diabetes_Risk_Report_${new Date().toLocaleDateString("en-US")}.pdf`);
      console.log("PDF download triggered successfully");
    } catch (error) {
      console.error("PDF generation error:", error);
      alert("Failed to generate PDF. Check console for details.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container max-w-4xl py-10 px-4 mx-auto">
        <Card className="border-2 shadow-xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-3xl font-bold">Preliminary Analysis Report</CardTitle>
          </CardHeader>

          <CardContent className="space-y-10">
            {/* Probability + Circle + Risk Level */}
            <div className="flex flex-col items-center">
              <span className="text-6xl font-bold mb-3" style={{ color: riskColor }}>
                {probability.toFixed(4)}%
              </span>

              <div className="w-48 h-48 relative mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      fill="#8884d8"
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                    >
                      <Cell fill={riskColor} />
                      <Cell fill="#e5e7eb" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <span className="text-base text-muted-foreground mb-3">
                Diabetes Risk Probability
              </span>

              <Badge className={`text-xl px-10 py-4 font-semibold ${
                probability > 70 ? "border-destructive text-destructive bg-destructive/10" :
                probability > 50 ? "border-orange-500 text-orange-600 bg-orange-50" :
                probability > 20 ? "border-yellow-500 text-yellow-600 bg-yellow-50" :
                "border-green-500 text-green-600 bg-green-50"
              }`}>
                Risk Level: {riskLevel}
              </Badge>
            </div>

            {/* Main Message */}
            <Alert className={probability > 70 ? "border-destructive bg-destructive/5" : "border-yellow-500 bg-yellow-50"}>
              <AlertTriangle className={`h-6 w-6 ${probability > 70 ? "text-destructive" : "text-yellow-600"} mt-1`} />
              <div>
                <AlertTitle className="text-lg font-semibold">
                  {probability > 70 ? "Important Warning" : "Preliminary Result"}
                </AlertTitle>
                <AlertDescription className="text-base mt-2">
                  {message}
                </AlertDescription>
              </div>
            </Alert>

            {/* Recommendations */}
            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Personalized Recommendations</h3>
              <ul className="space-y-3 text-sm list-disc list-inside">
                {recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>

            {/* Input Data */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(formData).map(([key, value]) => (
                <div key={key} className="bg-background border rounded-lg p-4">
                  <div className="text-sm text-muted-foreground capitalize">
                    {key}
                  </div>
                  <div className="text-lg font-semibold mt-1">
                    {value as string}
                  </div>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button variant="outline" asChild className="w-full sm:w-auto">
                <Link to="/diagnosis">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  New Analysis
                </Link>
              </Button>

              <Button 
                onClick={downloadPDF}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Report (PDF)
              </Button>
            </div>

            {/* Legal Disclaimer */}
            <Alert variant="destructive" className="mt-10">
              <AlertTriangle className="h-5 w-5" />
              <AlertTitle>Important Disclaimer</AlertTitle>
              <AlertDescription className="mt-2">
                This is a preliminary report only and is not a final medical diagnosis. 
                Please consult a specialist doctor for accurate evaluation and additional tests.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}