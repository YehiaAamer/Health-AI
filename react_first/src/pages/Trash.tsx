import { Link } from "react-router-dom";
import { useMemo, useRef, useState } from "react";
import Header from "@/components/Shared/Header";
import Footer from "@/components/Shared/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  RotateCcw,
  FileText,
  Archive,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useTrash } from "@/contexts/TrashContext";
import { useIsVisible } from "@/hooks/useIsVisible";

const DESKTOP_HEADER_HEIGHT = 72;
const REPORTS_PER_PAGE = 7;

const Trash = () => {
  const { t, i18n } = useTranslation();
  const { trashedItems, restoreFromTrash } = useTrash();
  const isArabic = i18n.language === "ar";

  const headerRef = useRef(null);
  const contentRef = useRef(null);

  const headerVisible = useIsVisible(headerRef);
  const contentVisible = useIsVisible(contentRef);

  const [currentPage, setCurrentPage] = useState(1);

  const sortedTrashedItems = useMemo(() => {
    return [...trashedItems].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [trashedItems]);

  const totalPages = Math.ceil(sortedTrashedItems.length / REPORTS_PER_PAGE);

  const paginatedTrashedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * REPORTS_PER_PAGE;
    return sortedTrashedItems.slice(startIndex, startIndex + REPORTS_PER_PAGE);
  }, [sortedTrashedItems, currentPage]);

  const handleRestore = (id: number) => {
    restoreFromTrash(id);
    toast.success(t("trash.restoreSuccess"));

    if (paginatedTrashedItems.length === 1 && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const normalizeRiskLevel = (riskLevel?: string) => {
    const risk = (riskLevel || "").trim().toLowerCase();

    if (
      risk.includes("high") ||
      risk.includes("مرتفع") ||
      risk.includes("عالي")
    ) {
      return "high";
    }

    if (
      risk.includes("medium") ||
      risk.includes("moderate") ||
      risk.includes("متوسط")
    ) {
      return "medium";
    }

    if (
      risk.includes("low") ||
      risk.includes("منخفض") ||
      risk.includes("قليل")
    ) {
      return "low";
    }

    return "unknown";
  };

  const getLocalizedRiskLabel = (riskLevel?: string) => {
    const normalized = normalizeRiskLevel(riskLevel);

    switch (normalized) {
      case "high":
        return t("dashboard.riskHigh");
      case "medium":
        return t("dashboard.riskMedium");
      case "low":
        return t("dashboard.riskLow");
      default:
        return riskLevel || "--";
    }
  };

  const getRiskBadgeColor = (riskLevel?: string) => {
    switch (normalizeRiskLevel(riskLevel)) {
      case "low":
        return "border-green-200 bg-green-100 text-green-700 hover:border-green-200 hover:bg-green-100 hover:text-green-700";
      case "medium":
        return "border-yellow-200 bg-yellow-100 text-yellow-700 hover:border-yellow-200 hover:bg-yellow-100 hover:text-yellow-700";
      case "high":
        return "border-red-200 bg-red-100 text-red-700 hover:border-red-200 hover:bg-red-100 hover:text-red-700";
      default:
        return "border-gray-200 bg-gray-100 text-gray-700 hover:border-gray-200 hover:bg-gray-100 hover:text-gray-700";
    }
  };

  const getTopRiskIndicators = (item: (typeof trashedItems)[number]) => {
    const indicators = [
      {
        key: "pregnancies",
        label: t("dashboard.pregnancies"),
        value: item.pregnancies,
      },
      {
        key: "glucose",
        label: t("dashboard.glucose"),
        value: item.glucose,
      },
      {
        key: "blood_pressure",
        label: t("dashboard.bloodPressure"),
        value: item.blood_pressure,
      },
      {
        key: "skin_thickness",
        label: t("dashboard.skinThickness"),
        value: item.skin_thickness,
      },
      {
        key: "insulin",
        label: t("dashboard.insulin"),
        value: item.insulin,
      },
      {
        key: "bmi",
        label: t("dashboard.bmi"),
        value: Number(item.bmi),
      },
      {
        key: "diabetes_pedigree_function",
        label: t("dashboard.diabetesPedigree"),
        value: Number(item.diabetes_pedigree_function),
      },
      {
        key: "age",
        label: t("dashboard.age"),
        value: item.age,
      },
    ];

    return indicators.sort((a, b) => b.value - a.value).slice(0, 3);
  };

  const formatNumber = (
    value: number,
    options?: Intl.NumberFormatOptions
  ) => {
    return value.toLocaleString(isArabic ? "ar-EG" : "en-US", options);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(isArabic ? "ar-SA" : "en-US");
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString(isArabic ? "ar-EG" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-slate-50"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <Header variant="dashboard" />

      <main
        className="flex-1"
        style={{ paddingTop: `${DESKTOP_HEADER_HEIGHT}px` }}
      >
        <section className="border-b bg-background">
          <div className="container mx-auto px-4 py-8 md:py-10">
            <div
              ref={headerRef}
              className={`transition-all duration-700 ease-out ${
                headerVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className={isArabic ? "text-right" : "text-left"}>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                  {t("trash.title")}
                </h1>
                <p className="text-muted-foreground max-w-2xl">
                  {t("trash.subtitle")}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div
            ref={contentRef}
            className={`transition-all duration-700 ease-out ${
              contentVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="p-5 shadow-sm border-0 bg-background rounded-3xl">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Archive className="h-5 w-5 text-primary" />
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        {t("trash.deletedReports")}
                      </p>
                      <p className="text-3xl font-bold text-foreground">
                        {formatNumber(trashedItems.length)}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-5 shadow-sm border-0 bg-background rounded-3xl">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        {t("trash.latestDeletedReport")}
                      </p>
                      <p className="text-3xl font-bold text-foreground">
                        {sortedTrashedItems[0]
                          ? `#${formatNumber(sortedTrashedItems[0].id)}`
                          : "--"}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="rounded-[26px] border bg-background p-5 md:p-6 shadow-sm">
                {sortedTrashedItems.length === 0 ? (
                  <div className="rounded-[22px] border border-dashed p-12 text-center bg-muted/15">
                    <div className="mx-auto mb-5 h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Trash2 className="h-7 w-7 text-primary" />
                    </div>

                    <h4 className="text-xl font-semibold mb-2">
                      {t("trash.emptyTitle")}
                    </h4>

                    <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                      {t("trash.emptyDescription")}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="hidden lg:block overflow-x-auto">
                      <div className="min-w-[1080px] overflow-hidden rounded-[22px] border">
                        <div className="grid grid-cols-[2fr_1.45fr_1.05fr_.75fr_1.1fr] gap-4 bg-muted/30 px-5 py-4 text-sm font-semibold text-muted-foreground">
                          <span className="text-start">
                            {t("trash.report")}
                          </span>
                          <span className="text-start">
                            {t("dashboard.riskIndicators")}
                          </span>
                          <span className="text-start whitespace-nowrap">
                            {t("trash.date")}
                          </span>
                          <span className="text-start whitespace-nowrap">
                            {t("pastReportsPage.reportId")}
                          </span>
                          <span
                            className={`whitespace-nowrap ${
                              isArabic ? "text-left" : "text-right"
                            }`}
                          >
                            {t("trash.actions")}
                          </span>
                        </div>

                        {paginatedTrashedItems.map((item) => {
                          const topIndicators = getTopRiskIndicators(item);

                          return (
                            <div
                              key={item.id}
                              className="grid grid-cols-[2fr_1.45fr_1.05fr_.75fr_1.1fr] gap-4 items-center px-5 py-5 border-t hover:bg-muted/10 transition-colors"
                            >
                              <div className="min-w-0">
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                    <FileText className="h-4 w-4 text-primary" />
                                  </div>

                                  <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <p className="font-semibold truncate">
                                        {t("dashboard.infectionProbability")}:{" "}
                                        {formatNumber(item.probability, {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                        })}
                                        %
                                      </p>

                                      <Badge
                                        className={`border text-xs transition-none ${getRiskBadgeColor(
                                          item.risk_level
                                        )}`}
                                      >
                                        {getLocalizedRiskLabel(item.risk_level)}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="min-w-0">
                                <div className="flex flex-col gap-1 text-sm">
                                  {topIndicators.map((indicator) => (
                                    <div
                                      key={indicator.key}
                                      className="flex items-center gap-2 min-w-0"
                                    >
                                      <span className="font-medium text-foreground whitespace-nowrap">
                                        {indicator.label}:
                                      </span>
                                      <span className="text-muted-foreground whitespace-nowrap">
                                        {formatNumber(indicator.value)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="text-sm text-muted-foreground">
                                <p className="whitespace-nowrap">
                                  {formatDate(item.created_at)}
                                </p>

                                <p className="mt-1 text-xs text-muted-foreground whitespace-nowrap">
                                  {formatTime(item.created_at)}
                                </p>
                              </div>

                              <div>
                                <div className="inline-flex rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary whitespace-nowrap">
                                  #{formatNumber(item.id)}
                                </div>
                              </div>

                              <div
                                className={`flex items-center gap-2 ${
                                  isArabic ? "justify-start" : "justify-end"
                                }`}
                              >
                                <Link
                                  to="/report"
                                  state={{
                                    formData: {
                                      pregnancies: item.pregnancies,
                                      glucose: item.glucose,
                                      bloodPressure: item.blood_pressure,
                                      skinThickness: item.skin_thickness,
                                      insulin: item.insulin,
                                      bmi: item.bmi,
                                      diabetesPedigreeFunction:
                                        item.diabetes_pedigree_function,
                                      age: item.age,
                                    },
                                    probability: item.probability,
                                    riskLevel: item.risk_level,
                                    message: item.message,
                                    predictionId: item.id,
                                  }}
                                >
                                  <Button
                                    variant="ghost"
                                    className="rounded-xl whitespace-nowrap h-10"
                                  >
                                    {t("dashboard.viewReport")}
                                  </Button>
                                </Link>

                                <Button
                                  type="button"
                                  variant="outline"
                                  className="rounded-xl h-10 px-4 gap-2 whitespace-nowrap"
                                  onClick={() => handleRestore(item.id)}
                                >
                                  <RotateCcw className="h-4 w-4" />
                                  {t("trash.restore")}
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid gap-4 lg:hidden">
                      {paginatedTrashedItems.map((item) => {
                        const topIndicators = getTopRiskIndicators(item);

                        return (
                          <div
                            key={item.id}
                            className="rounded-[20px] border p-4 bg-background"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                <FileText className="h-4 w-4 text-primary" />
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="font-semibold leading-snug">
                                    {t("dashboard.infectionProbability")}:{" "}
                                    {formatNumber(item.probability, {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}
                                    %
                                  </p>

                                  <Badge
                                    className={`border text-xs transition-none ${getRiskBadgeColor(
                                      item.risk_level
                                    )}`}
                                  >
                                    {getLocalizedRiskLabel(item.risk_level)}
                                  </Badge>
                                </div>

                                <p className="mt-2 text-xs text-primary font-semibold">
                                  #{formatNumber(item.id)}
                                </p>

                                <div className="mt-4 rounded-xl bg-muted/30 p-3">
                                  <p className="text-xs text-muted-foreground mb-2">
                                    {t("dashboard.riskIndicators")}
                                  </p>

                                  <div className="flex flex-col gap-1 text-sm">
                                    {topIndicators.map((indicator) => (
                                      <div
                                        key={indicator.key}
                                        className="flex items-center gap-2 min-w-0"
                                      >
                                        <span className="font-medium text-foreground whitespace-nowrap">
                                          {indicator.label}:
                                        </span>
                                        <span className="text-muted-foreground whitespace-nowrap">
                                          {formatNumber(indicator.value)}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div className="mt-3 rounded-xl bg-muted/30 p-3">
                                  <p className="text-xs text-muted-foreground mb-1">
                                    {t("trash.date")}
                                  </p>

                                  <p className="text-sm text-muted-foreground">
                                    {formatDate(item.created_at)}
                                  </p>

                                  <p className="mt-1 text-xs text-muted-foreground">
                                    {formatTime(item.created_at)}
                                  </p>
                                </div>

                                <div className="mt-4 flex flex-col gap-2">
                                  <Link
                                    to="/report"
                                    state={{
                                      formData: {
                                        pregnancies: item.pregnancies,
                                        glucose: item.glucose,
                                        bloodPressure: item.blood_pressure,
                                        skinThickness: item.skin_thickness,
                                        insulin: item.insulin,
                                        bmi: item.bmi,
                                        diabetesPedigreeFunction:
                                          item.diabetes_pedigree_function,
                                        age: item.age,
                                      },
                                      probability: item.probability,
                                      riskLevel: item.risk_level,
                                      message: item.message,
                                      predictionId: item.id,
                                    }}
                                  >
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      className="rounded-xl w-full h-10"
                                    >
                                      {t("dashboard.viewReport")}
                                    </Button>
                                  </Link>

                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="rounded-xl w-full h-10 gap-2"
                                    onClick={() => handleRestore(item.id)}
                                  >
                                    <RotateCcw className="h-4 w-4" />
                                    {t("trash.restore")}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 pt-5">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="rounded-xl"
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={currentPage === 1}
                          aria-label="Previous page"
                        >
                          {isArabic ? (
                            <ChevronRight className="h-4 w-4" />
                          ) : (
                            <ChevronLeft className="h-4 w-4" />
                          )}
                        </Button>

                        {Array.from({ length: totalPages }, (_, index) => {
                          const page = index + 1;
                          const isActive = currentPage === page;

                          return (
                            <Button
                              key={page}
                              type="button"
                              variant={isActive ? "default" : "outline"}
                              className="h-9 min-w-9 rounded-xl px-3"
                              onClick={() => setCurrentPage(page)}
                            >
                              {page.toLocaleString(isArabic ? "ar-EG" : "en-US")}
                            </Button>
                          );
                        })}

                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="rounded-xl"
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages)
                            )
                          }
                          disabled={currentPage === totalPages}
                          aria-label="Next page"
                        >
                          {isArabic ? (
                            <ChevronLeft className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Trash;