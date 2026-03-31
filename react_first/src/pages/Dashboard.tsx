import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Beaker,
  Plus,
  Search,
  LayoutDashboard,
  FileText,
  Activity,
  Clock3,
  ShieldCheck,
  AlertTriangle,
  Stethoscope,
  PhoneCall,
  Settings,
  ChevronDown,
  User,
} from "lucide-react";
import Header from "@/components/Shared/Header";
import Footer from "@/components/Shared/Footer";
import { toast } from "sonner";
import { useEffect, useMemo, useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { apiCall, API_ENDPOINTS } from "@/lib/api";
import { useTranslation } from "react-i18next";
import { useIsVisible } from "@/hooks/useIsVisible";

interface Prediction {
  id: number;
  pregnancies: number;
  glucose: number;
  blood_pressure: number;
  skin_thickness: number;
  insulin: number;
  bmi: number;
  diabetes_pedigree_function: number;
  age: number;
  probability: number;
  risk_level: string;
  message: string;
  created_at: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const sidebarRef = useRef(null);
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const analysesRef = useRef(null);
  const doctorRef = useRef(null);

  const sidebarVisible = useIsVisible(sidebarRef);
  const heroVisible = useIsVisible(heroRef);
  const statsVisible = useIsVisible(statsRef);
  const analysesVisible = useIsVisible(analysesRef);
  const doctorVisible = useIsVisible(doctorRef);

  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setIsLoading(true);

        const data = await apiCall<{
          count: number;
          predictions: Prediction[];
        }>(API_ENDPOINTS.GET_PREDICTIONS, {
          method: "GET",
        });

        setPredictions(
          (data.predictions || []).sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
        );
      } catch (err) {
        console.error("Error fetching predictions:", err);
        setError(t("dashboard.fetchError"));
        toast.error(t("dashboard.dataError"));
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchPredictions();
    }
  }, [user, t]);

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

  const formatNumber = (
    value: number,
    options?: Intl.NumberFormatOptions
  ) => {
    return value.toLocaleString(isArabic ? "ar-EG" : "en-US", options);
  };

  const formatValue = (
    value?: number | null,
    options?: Intl.NumberFormatOptions
  ) => {
    return value != null ? formatNumber(value, options) : "--";
  };

  const normalizeSearchText = (value: unknown) => {
    return String(value ?? "")
      .toLowerCase()
      .trim()
      .normalize("NFKD")
      .replace(/[\u064B-\u065F]/g, "")
      .replace(/\s+/g, " ");
  };

  const filteredPredictions = useMemo(() => {
    const query = normalizeSearchText(searchTerm);

    if (!query) return predictions;

    return predictions.filter((pred) => {
      const localizedDate = new Date(pred.created_at).toLocaleDateString(
        isArabic ? "ar-SA" : "en-US"
      );

      const searchableContent = normalizeSearchText(
        [
          pred.id,
          pred.pregnancies,
          pred.glucose,
          pred.blood_pressure,
          pred.skin_thickness,
          pred.insulin,
          pred.bmi,
          pred.diabetes_pedigree_function,
          pred.age,
          pred.probability?.toFixed?.(2) ?? pred.probability,
          pred.risk_level,
          getLocalizedRiskLabel(pred.risk_level),
          pred.message,
          localizedDate,
        ].join(" ")
      );

      return searchableContent.includes(query);
    });
  }, [predictions, searchTerm, isArabic, t]);

  const latestPrediction = predictions[0];

  const averageRisk = useMemo(() => {
    if (!filteredPredictions.length) return 0;

    const total = filteredPredictions.reduce(
      (sum, pred) => sum + pred.probability,
      0
    );

    return total / filteredPredictions.length;
  }, [filteredPredictions]);

  const latestRiskTextColor = useMemo(() => {
    if (!latestPrediction) return "text-foreground";

    const normalized = normalizeRiskLevel(latestPrediction.risk_level);

    if (normalized === "high") return "text-red-500";
    if (normalized === "medium") return "text-amber-500";
    return "text-primary";
  }, [latestPrediction]);

  const latestRiskBadgeClass = useMemo(() => {
    if (!latestPrediction) {
      return "bg-muted text-muted-foreground border-border";
    }

    const normalized = normalizeRiskLevel(latestPrediction.risk_level);

    if (normalized === "high") {
      return "bg-red-500/10 text-red-600 border-red-500/20";
    }

    if (normalized === "medium") {
      return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    }

    return "bg-primary/10 text-primary border-primary/20";
  }, [latestPrediction]);

  const completionTarget = Math.max(filteredPredictions.length + 1, 4);
  const completionValue = Math.min((filteredPredictions.length / 4) * 100, 100);

  const sidebarContent = (
    <>
      <div className="flex items-center gap-3 pb-4 border-b">
        <div className="w-11 h-11 rounded-full overflow-hidden bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center shrink-0">
          {user?.profile_picture ? (
            <img
              src={user.profile_picture}
              alt={user?.first_name || user?.email || "Profile"}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="h-5 w-5 text-white" />
          )}
        </div>

        <div className="min-w-0">
          <p className="font-semibold truncate">
            {user?.first_name || user?.email || "User"}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {user?.email || "HealthAI Account"}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          {t("dashboard.mainMenu")}
        </p>

        <div className="space-y-2">
          <div className="flex items-center gap-3 rounded-xl bg-primary/10 text-primary px-3 py-3 font-medium">
            <LayoutDashboard className="h-5 w-5" />
            <span>{t("dashboard.title")}</span>
          </div>

          <Link to="/diagnosis" className="block">
            <div className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-accent transition-colors">
              <Beaker className="h-5 w-5 text-muted-foreground" />
              <span>{t("dashboard.newCheckup")}</span>
            </div>
          </Link>

          <Link
            to="/past-reports"
            className="block"
            onClick={() => {
              if (predictions.length === 0) {
                toast.info(t("dashboard.noReportsYet"));
              }
            }}
          >
            <div className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-accent transition-colors">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <span>{t("dashboard.previousReports")}</span>
            </div>
          </Link>

          <Link to="/consultations" className="block">
            <div className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-accent transition-colors">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span>{t("dashboard.bookConsultation")}</span>
            </div>
          </Link>
        </div>

        <div className="mt-4 pt-4 border-t">
          <Link to="/edit-profile" className="block">
            <div className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-accent transition-colors">
              <Settings className="h-5 w-5 text-muted-foreground" />
              <span>{t("dashboard.settings")}</span>
            </div>
          </Link>
        </div>
      </div>
    </>
  );

  return (
    <div
      className="min-h-screen flex flex-col bg-background"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <Header variant="dashboard" />

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-[230px_minmax(0,1fr)] gap-6 items-start">
          <div className="xl:hidden">
            <button
              type="button"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="mb-4 flex items-center gap-2 rounded-xl border bg-card px-4 py-3 shadow-sm"
            >
              <ChevronDown
                className={`h-5 w-5 transition-transform duration-300 ${
                  isSidebarOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-out ${
                isSidebarOpen
                  ? "max-h-[600px] opacity-100 mb-4"
                  : "max-h-0 opacity-0"
              }`}
            >
              <Card className="rounded-[24px] border bg-card p-4 shadow-sm">
                {sidebarContent}
              </Card>
            </div>
          </div>

          <aside
            ref={sidebarRef}
            className={`hidden xl:block transition-all duration-700 ease-out ${
              sidebarVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <Card className="rounded-[24px] border bg-card p-4 shadow-sm xl:sticky xl:top-24">
              {sidebarContent}
            </Card>
          </aside>

          <div className="space-y-5 min-w-0">
            <div
              ref={heroRef}
              className={`flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between transition-all duration-700 ease-out delay-100 ${
                heroVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className={isArabic ? "text-right" : "text-left"}>
                <h1 className="text-3xl font-bold">{t("dashboard.title")}</h1>
                <p className="text-muted-foreground mt-1">
                  {t("dashboard.welcome")}{" "}
                  {user
                    ? `${t("dashboard.hello")} ${user.first_name || user.email}!`
                    : ""}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                <div className="relative w-full md:w-[280px] lg:w-[320px]">
                  <Search
                    className={`h-4 w-4 text-muted-foreground absolute top-1/2 -translate-y-1/2 ${
                      isArabic ? "right-3" : "left-3"
                    }`}
                  />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t("dashboard.search")}
                    className={`rounded-xl h-11 ${
                      isArabic
                        ? "pr-9 pl-10 text-right"
                        : "pl-9 pr-10 text-left"
                    }`}
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground ${
                        isArabic ? "left-3" : "right-3"
                      }`}
                      aria-label={t("dashboard.clearSearch")}
                    >
                      ×
                    </button>
                  )}
                </div>

                <Link to="/diagnosis">
                  <Button className="rounded-xl gap-2 h-11 w-full sm:w-auto">
                    <Plus className="h-5 w-5" />
                    {t("dashboard.newTest")}
                  </Button>
                </Link>
              </div>
            </div>

            <section
              ref={statsRef}
              className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 transition-all duration-700 ease-out delay-200 ${
                statsVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <Card className="rounded-[20px] border bg-card p-5 shadow-sm">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {t("dashboard.averageRisk")}
                </p>
                <h3 className="text-3xl font-bold">
                  {filteredPredictions.length
                    ? `${formatNumber(averageRisk, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}%`
                    : "--"}
                </h3>
              </Card>

              <Card className="rounded-[20px] border bg-card p-5 shadow-sm">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {t("dashboard.latestStatus")}
                </p>
                <h3 className={`text-3xl font-bold ${latestRiskTextColor}`}>
                  {latestPrediction
                    ? getLocalizedRiskLabel(latestPrediction.risk_level)
                    : "--"}
                </h3>
              </Card>

              <Card className="rounded-[20px] border bg-card p-5 shadow-sm">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {t("dashboard.savedReports")}
                </p>
                <h3 className="text-3xl font-bold">
                  {formatNumber(filteredPredictions.length)}
                </h3>
              </Card>

              <Card className="rounded-[20px] border bg-card p-5 shadow-sm">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Clock3 className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {t("dashboard.lastCheckup")}
                </p>
                <h3 className="text-2xl font-bold">
                  {latestPrediction
                    ? new Date(latestPrediction.created_at).toLocaleDateString(
                        isArabic ? "ar-SA" : "en-US"
                      )
                    : "--"}
                </h3>
              </Card>
            </section>

            <section
              ref={analysesRef}
              className={`grid grid-cols-1 gap-5 items-start transition-all duration-700 ease-out delay-300 ${
                analysesVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <Card className="rounded-[24px] border bg-card p-5 md:p-6 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-5">
                  <div className={isArabic ? "text-right" : "text-left"}>
                    <h3 className="text-2xl font-bold">
                      {t("dashboard.recentAnalyses")}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t("dashboard.analysisOverview")}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="rounded-xl">
                      {t("dashboard.weekly")}
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-xl">
                      {t("dashboard.monthly")}
                    </Button>
                  </div>
                </div>

                <div className="rounded-[22px] border bg-gradient-to-b from-primary/5 via-background to-background p-5 mb-5">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {t("dashboard.latestAnalysisScore")}
                      </p>
                      <h2 className="text-4xl font-bold">
                        {latestPrediction
                          ? `${formatNumber(latestPrediction.probability, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}%`
                          : "--"}
                      </h2>
                      <div className="mt-3">
                        <span
                          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${latestRiskBadgeClass}`}
                        >
                          {latestPrediction
                            ? getLocalizedRiskLabel(latestPrediction.risk_level)
                            : t("dashboard.noData")}
                        </span>
                      </div>
                    </div>

                    <div
                      className={isArabic ? "md:text-left" : "md:text-right"}
                    >
                      <p className="text-sm text-muted-foreground mb-2">
                        {t("dashboard.progress")}
                      </p>
                      <p className="text-xl font-semibold text-primary">
                        {formatNumber(filteredPredictions.length)}{" "}
                        {t("dashboard.outOf")} {formatNumber(completionTarget)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Progress value={completionValue} className="h-2.5" />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="rounded-xl border bg-card p-3">
                        <p className="text-xs text-muted-foreground mb-1">
                          {t("dashboard.pregnancies")}
                        </p>
                        <p className="font-semibold">
                          {formatValue(latestPrediction?.pregnancies)}
                        </p>
                      </div>

                      <div className="rounded-xl border bg-card p-3">
                        <p className="text-xs text-muted-foreground mb-1">
                          {t("dashboard.glucose")}
                        </p>
                        <p className="font-semibold">
                          {formatValue(latestPrediction?.glucose)}
                        </p>
                      </div>

                      <div className="rounded-xl border bg-card p-3">
                        <p className="text-xs text-muted-foreground mb-1">
                          {t("dashboard.bloodPressure")}
                        </p>
                        <p className="font-semibold">
                          {formatValue(latestPrediction?.blood_pressure)}
                        </p>
                      </div>

                      <div className="rounded-xl border bg-card p-3">
                        <p className="text-xs text-muted-foreground mb-1">
                          {t("dashboard.skinThickness")}
                        </p>
                        <p className="font-semibold">
                          {formatValue(latestPrediction?.skin_thickness)}
                        </p>
                      </div>

                      <div className="rounded-xl border bg-card p-3">
                        <p className="text-xs text-muted-foreground mb-1">
                          {t("dashboard.insulin")}
                        </p>
                        <p className="font-semibold">
                          {formatValue(latestPrediction?.insulin)}
                        </p>
                      </div>

                      <div className="rounded-xl border bg-card p-3">
                        <p className="text-xs text-muted-foreground mb-1">
                          {t("dashboard.bmi")}
                        </p>
                        <p className="font-semibold">
                          {formatValue(latestPrediction?.bmi, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>

                      <div className="rounded-xl border bg-card p-3">
                        <p className="text-xs text-muted-foreground mb-1">
                          {t("dashboard.diabetesPedigree")}
                        </p>
                        <p className="font-semibold">
                          {formatValue(
                            latestPrediction?.diabetes_pedigree_function,
                            {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </p>
                      </div>

                      <div className="rounded-xl border bg-card p-3">
                        <p className="text-xs text-muted-foreground mb-1">
                          {t("dashboard.age")}
                        </p>
                        <p className="font-semibold">
                          {formatValue(latestPrediction?.age)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl border p-4 animate-pulse"
                      >
                        <div className="h-4 w-48 bg-muted rounded mb-3" />
                        <div className="h-3 w-32 bg-muted rounded mb-2" />
                        <div className="h-3 w-24 bg-muted rounded" />
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
                    <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-red-500/10 flex items-center justify-center">
                      <AlertTriangle className="h-6 w-6 text-red-500" />
                    </div>
                    <h4 className="font-semibold mb-2">
                      {t("dashboard.unableToLoadAnalyses")}
                    </h4>
                    <p className="text-sm text-red-500">{error}</p>
                  </div>
                ) : predictions.length === 0 ? (
                  <div className="rounded-2xl border border-dashed p-10 text-center bg-muted/20">
                    <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Beaker className="h-7 w-7 text-primary" />
                    </div>
                    <h4 className="text-lg font-semibold mb-2">
                      {t("dashboard.noPreviousAnalyses")}
                    </h4>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      {t("dashboard.healthTipText")}
                    </p>
                    <Link to="/diagnosis">
                      <Button className="rounded-xl">
                        {t("dashboard.firstTestNow")}
                      </Button>
                    </Link>
                  </div>
                ) : filteredPredictions.length === 0 ? (
                  <div className="rounded-2xl border border-dashed p-10 text-center bg-muted/20">
                    <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Search className="h-7 w-7 text-primary" />
                    </div>
                    <h4 className="text-lg font-semibold mb-2">
                      {t("dashboard.noSearchResults")}
                    </h4>
                    <p className="text-muted-foreground">
                      {t("dashboard.tryAnotherSearch")}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-2xl border">
                    <div className="grid grid-cols-[1.5fr_.8fr_.9fr_.8fr] gap-4 bg-muted/30 px-4 py-3 text-sm font-medium">
                      <span>{t("dashboard.recentAnalyses")}</span>
                      <span>{t("dashboard.glucose")}</span>
                      <span>{t("dashboard.date")}</span>
                      <span className={isArabic ? "text-left" : "text-right"}>
                        {t("dashboard.action")}
                      </span>
                    </div>

                    {filteredPredictions.slice(0, 4).map((pred) => {
                      const normalized = normalizeRiskLevel(pred.risk_level);

                      const badgeClass =
                        normalized === "high"
                          ? "bg-red-500/10 text-red-600 border-red-500/20"
                          : normalized === "medium"
                          ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          : "bg-primary/10 text-primary border-primary/20";

                      return (
                        <div
                          key={pred.id}
                          className="grid grid-cols-[1.5fr_.8fr_.9fr_.8fr] gap-4 items-center px-4 py-4 border-t"
                        >
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <p className="font-semibold truncate">
                                {t("dashboard.infectionProbability")}:{" "}
                                {formatNumber(pred.probability, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                                %
                              </p>
                              <span
                                className={`inline-flex rounded-full border px-2 py-1 text-[11px] font-medium ${badgeClass}`}
                              >
                                {getLocalizedRiskLabel(pred.risk_level)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {pred.message}
                            </p>
                          </div>

                          <div className="text-sm font-medium">
                            {formatNumber(pred.glucose)}
                          </div>

                          <div className="text-sm text-muted-foreground">
                            {new Date(pred.created_at).toLocaleDateString(
                              isArabic ? "ar-SA" : "en-US"
                            )}
                          </div>

                          <div className={isArabic ? "text-left" : "text-right"}>
                            <Link
                              to="/report"
                              state={{
                                formData: {
                                  pregnancies: pred.pregnancies,
                                  glucose: pred.glucose,
                                  bloodPressure: pred.blood_pressure,
                                  skinThickness: pred.skin_thickness,
                                  insulin: pred.insulin,
                                  bmi: pred.bmi,
                                  diabetesPedigreeFunction:
                                    pred.diabetes_pedigree_function,
                                  age: pred.age,
                                },
                                probability: pred.probability,
                                riskLevel: pred.risk_level,
                                message: pred.message,
                                predictionId: pred.id,
                              }}
                            >
                              <Button variant="ghost" className="rounded-xl">
                                {t("dashboard.viewReport")}
                              </Button>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            </section>

            <section
              ref={doctorRef}
              className={`grid grid-cols-1 gap-5 items-start transition-all duration-700 ease-out delay-[400ms] ${
                doctorVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <Card className="rounded-[24px] border bg-card p-5 shadow-sm">
                <div className="mb-5">
                  <h3 className="font-bold text-xl">
                    {t("dashboard.lastDoctorContact")}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t("dashboard.lastDoctorContactDesc")}
                  </p>
                </div>

                <div className="rounded-[20px] border bg-primary/5 p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Stethoscope className="h-6 w-6 text-primary" />
                      </div>

                      <div className="min-w-0">
                        <h4 className="text-lg font-semibold truncate">
                          {t("dashboard.doctorCardTitle")}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t("dashboard.doctorCardText")}
                        </p>
                      </div>
                    </div>

                    <Link to="/consultations">
                      <Button variant="outline" className="rounded-xl gap-2">
                        <PhoneCall className="h-4 w-4" />
                        {t("dashboard.openConsultations")}
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;