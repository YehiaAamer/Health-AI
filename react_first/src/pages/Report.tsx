import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowLeft, Download } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Header from "@/components/Shared/Header";
import Footer from "@/components/Shared/Footer";
import { useTranslation } from "react-i18next";

interface ExtendedjsPDF extends jsPDF {
  lastAutoTable?: {
    finalY: number;
  };
}

const DESKTOP_HEADER_HEIGHT = 72;

export default function Report() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const result = location.state || {};

  useEffect(() => {
    if (result.probability === undefined || result.probability === null) {
      const timer = setTimeout(() => {
        navigate("/diagnosis", { replace: true });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [result.probability, navigate]);

  const probability = Number(result.probability ?? 0);
  const riskLevel = result.riskLevel ?? t("report.unknown");
  const message = result.message ?? "";
  const formData = result.formData || {};

  const normalizeRiskLevel = (risk?: string) => {
    const value = String(risk || "").trim().toLowerCase();

    if (
      value.includes("high") ||
      value.includes("مرتفع") ||
      value.includes("عالي")
    ) {
      return "high";
    }

    if (
      value.includes("medium") ||
      value.includes("moderate") ||
      value.includes("متوسط")
    ) {
      return "medium";
    }

    if (
      value.includes("low") ||
      value.includes("منخفض") ||
      value.includes("قليل")
    ) {
      return "low";
    }

    return "unknown";
  };

  const normalizedRisk = normalizeRiskLevel(riskLevel);

  const localizedRiskLevel = useMemo(() => {
    switch (normalizedRisk) {
      case "high":
        return t("report.riskHigh");
      case "medium":
        return t("report.riskMedium");
      case "low":
        return t("report.riskLow");
      default:
        return riskLevel || t("report.unknown");
    }
  }, [normalizedRisk, riskLevel, t]);

  const riskColor =
    probability > 70
      ? "#ef4444"
      : probability > 50
      ? "#f97316"
      : probability > 20
      ? "#eab308"
      : "#22c55e";

  const pieData = [
    { name: t("report.diabetesRisk"), value: probability },
    { name: t("report.remaining"), value: 100 - probability },
  ];

  const recommendations = useMemo(() => {
    if (probability > 70) {
      return [
        t("report.recommendations.high.1"),
        t("report.recommendations.high.2"),
        t("report.recommendations.high.3"),
        t("report.recommendations.high.4"),
      ];
    }

    if (probability > 50) {
      return [
        t("report.recommendations.mediumHigh.1"),
        t("report.recommendations.mediumHigh.2"),
        t("report.recommendations.mediumHigh.3"),
        t("report.recommendations.mediumHigh.4"),
      ];
    }

    if (probability > 20) {
      return [
        t("report.recommendations.moderate.1"),
        t("report.recommendations.moderate.2"),
        t("report.recommendations.moderate.3"),
        t("report.recommendations.moderate.4"),
      ];
    }

    return [
      t("report.recommendations.low.1"),
      t("report.recommendations.low.2"),
      t("report.recommendations.low.3"),
      t("report.recommendations.low.4"),
    ];
  }, [probability, t]);

  const getFieldLabel = (key: string) => {
    switch (key) {
      case "pregnancies":
        return t("report.fields.pregnancies");
      case "glucose":
        return t("report.fields.glucose");
      case "bloodPressure":
      case "blood_pressure":
        return t("report.fields.bloodPressure");
      case "skinThickness":
      case "skin_thickness":
        return t("report.fields.skinThickness");
      case "insulin":
        return t("report.fields.insulin");
      case "bmi":
        return t("report.fields.bmi");
      case "diabetesPedigreeFunction":
      case "diabetes_pedigree_function":
        return t("report.fields.diabetesPedigreeFunction");
      case "age":
        return t("report.fields.age");
      default:
        return key;
    }
  };

  const downloadPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const currentDate = new Date().toLocaleDateString(
        isArabic ? "ar-EG" : "en-US"
      );

      doc.setFontSize(20);
      doc.text(t("report.pdf.title"), 105, 20, { align: "center" });

      doc.setFontSize(12);
      doc.text(`${t("report.pdf.analysisDate")}: ${currentDate}`, 105, 30, {
        align: "center",
      });

      doc.setFontSize(40);
      doc.setTextColor(riskColor);
      doc.text(`${probability.toFixed(2)}%`, 105, 60, { align: "center" });

      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text(t("report.diabetesRiskProbability"), 105, 75, {
        align: "center",
      });

      doc.setFontSize(16);
      doc.text(
        `${t("report.riskLevelLabel")}: ${localizedRiskLevel}`,
        105,
        90,
        { align: "center" }
      );

      doc.setFontSize(14);
      doc.text(message || t("report.noAdditionalMessage"), 20, 110, {
        maxWidth: 170,
        align: "left",
      });

      const tableData = Object.entries(formData).map(([key, value]) => [
        getFieldLabel(key),
        String(value),
      ]);

      autoTable(doc, {
        startY: 130,
        head: [[t("report.pdf.parameter"), t("report.pdf.value")]],
        body: tableData,
        theme: "grid",
        styles: {
          fontSize: 12,
          cellPadding: 5,
          halign: isArabic ? "right" : "left",
        },
        headStyles: {
          fillColor: [66, 139, 202],
          textColor: 255,
        },
        alternateRowStyles: { fillColor: [240, 240, 240] },
      });

      const finalY = (doc as ExtendedjsPDF).lastAutoTable?.finalY || 130;

      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(t("report.personalizedRecommendations"), 20, finalY + 15);

      recommendations.forEach((rec, i) => {
        doc.setFontSize(12);
        doc.text(`• ${rec}`, 25, finalY + 25 + i * 8, {
          maxWidth: 160,
        });
      });

      doc.save(
        `Diabetes_Risk_Report_${new Date().toISOString().slice(0, 10)}.pdf`
      );
    } catch (error) {
      console.error("PDF generation error:", error);
      alert(t("report.pdfError"));
    }
  };

  if (result.probability === undefined || result.probability === null) {
    return (
      <div
        className="min-h-screen flex flex-col bg-background"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <Header variant="dashboard" />
        <main
          className="flex-1 container mx-auto px-4 flex items-center justify-center"
          style={{
            paddingTop: `${DESKTOP_HEADER_HEIGHT + 32}px`,
            paddingBottom: "32px",
          }}
        >
          <Card className="w-full max-w-md rounded-2xl border border-border/60 shadow-lg">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10">
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
              </div>
              <h2 className="text-xl font-bold tracking-tight mb-2">
                {t("report.noResultTitle")}
              </h2>
              <p className="text-muted-foreground mb-6 leading-7">
                {t("report.noResultDescription")}
              </p>
              <Link to="/diagnosis">
                <Button className="w-full rounded-xl h-11">
                  <ArrowLeft
                    className={isArabic ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"}
                  />
                  {t("report.backToDiagnosis")}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col bg-background"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <Header variant="dashboard" />

      <main
        className="flex-1 container max-w-5xl px-4 mx-auto"
        style={{
          paddingTop: `${DESKTOP_HEADER_HEIGHT + 32}px`,
          paddingBottom: "40px",
        }}
      >
        <Card className="overflow-hidden rounded-3xl border border-border/60 shadow-xl bg-background/95">
          <CardHeader className="text-center pb-5 pt-8 px-6 md:px-8 border-b bg-muted/10">
            <CardTitle className="text-3xl md:text-4xl font-bold tracking-tight">
              {t("report.title")}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6">
              <Card className="rounded-3xl border border-border/60 shadow-sm overflow-hidden">
                <CardContent className="p-6 md:p-8 h-full flex flex-col items-center justify-center text-center bg-gradient-to-br from-background to-muted/20">
                  <div className="mb-2 text-sm font-medium text-muted-foreground">
                    {t("report.diabetesRiskProbability")}
                  </div>

                  <div
                    className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4"
                    style={{ color: riskColor }}
                  >
                    {probability.toFixed(2)}%
                  </div>

                  <div className="w-60 h-60 relative mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={72}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                          startAngle={90}
                          endAngle={-270}
                          stroke="none"
                        >
                          <Cell fill={riskColor} />
                          <Cell fill="#e5e7eb" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground mb-1">
                          {t("report.riskLevelLabel")}
                        </div>
                        <div className="text-sm font-semibold">
                          {localizedRiskLevel}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Badge
                    className={`pointer-events-none text-base px-6 py-3 font-semibold rounded-full border shadow-sm transition-none ${
                      probability > 70
                        ? "border-destructive text-destructive !bg-destructive/10 hover:!bg-destructive/10"
                        : probability > 50
                        ? "border-orange-500 text-orange-600 !bg-orange-50 hover:!bg-orange-50"
                        : probability > 20
                        ? "border-yellow-500 text-yellow-600 !bg-yellow-50 hover:!bg-yellow-50"
                        : "border-green-500 text-green-600 !bg-green-50 hover:!bg-green-50"
                    }`}
                  >
                    {localizedRiskLevel}
                  </Badge>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-6">
                <Card className="rounded-3xl border border-border/60 shadow-sm">
                  <CardContent className="p-6 md:p-7">
                    <h3 className="text-lg font-semibold mb-3">
                      {t("report.preliminaryResult")}
                    </h3>
                    <p className="text-sm md:text-base leading-7 text-muted-foreground">
                      {message || t("report.noAdditionalMessage")}
                    </p>
                  </CardContent>
                </Card>

                <Card className="rounded-3xl border border-border/60 shadow-sm bg-muted/20">
                  <CardContent className="p-6 md:p-7">
                    <h3 className="text-lg font-semibold mb-4">
                      {t("report.personalizedRecommendations")}
                    </h3>
                    <ul className="space-y-3 text-sm leading-7">
                      {recommendations.map((rec, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-3 rounded-2xl bg-background border border-border/50 px-4 py-3"
                        >
                          <span
                            className="mt-2 h-2 w-2 rounded-full shrink-0"
                            style={{ backgroundColor: riskColor }}
                          />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card className="rounded-3xl border border-border/60 shadow-sm">
              <CardContent className="p-6 md:p-7">
                <h3 className="text-lg font-semibold mb-4">
                  {t("report.pdf.parameter")}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {Object.entries(formData).map(([key, value]) => (
                    <div
                      key={key}
                      className="rounded-2xl border border-border/60 bg-background px-4 py-4"
                    >
                      <div className="text-sm text-muted-foreground leading-6">
                        {getFieldLabel(key)}
                      </div>
                      <div className="text-lg font-semibold mt-2 tracking-tight">
                        {String(value)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Button
                variant="outline"
                asChild
                className="w-full sm:w-auto rounded-xl h-11 px-6"
              >
                <Link to="/diagnosis">
                  <ArrowLeft
                    className={isArabic ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"}
                  />
                  {t("report.newAnalysis")}
                </Link>
              </Button>

              <Button
                onClick={downloadPDF}
                className="w-full sm:w-auto rounded-xl h-11 px-6 bg-primary hover:bg-primary/90"
              >
                <Download
                  className={isArabic ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"}
                />
                {t("report.downloadPdf")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}