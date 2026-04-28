import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  CircleHelp,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import Header from "@/components/Shared/Header";
import Footer from "@/components/Shared/Footer";
import { toast } from "sonner";
import { useEffect, useMemo, useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { apiCall, API_ENDPOINTS } from "@/lib/api";
import { useTranslation } from "react-i18next";
import { useIsVisible } from "@/hooks/useIsVisible";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

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

const DESKTOP_HEADER_HEIGHT = 72;
const DESKTOP_SIDEBAR_WIDTH = 260;
const DESKTOP_SIDEBAR_COLLAPSED_WIDTH = 88;

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const analysesRef = useRef(null);
  const doctorRef = useRef(null);

  const heroVisible = useIsVisible(heroRef);
  const statsVisible = useIsVisible(statsRef);
  const analysesVisible = useIsVisible(analysesRef);
  const doctorVisible = useIsVisible(doctorRef);

  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] =
    useState(false);
  const [selectedRange, setSelectedRange] = useState<
    "weekly" | "monthly" | null
  >(null);

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

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout error:", err);
      toast.error(t("dashboard.logoutError"));
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

  const getRiskTextClass = (riskLevel?: string) => {
    const normalized = normalizeRiskLevel(riskLevel);

    if (normalized === "high") return "text-red-500";
    if (normalized === "medium") return "text-yellow-600";
    if (normalized === "low") return "text-green-600";
    return "text-muted-foreground";
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
    return new Date(date).toLocaleTimeString(isArabic ? "ar-SA" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const normalizeSearchText = (value: unknown) => {
    return String(value ?? "")
      .toLowerCase()
      .trim()
      .normalize("NFKD")
      .replace(/[\u064B-\u065F]/g, "")
      .replace(/\s+/g, " ");
  };

  const getTopRiskIndicators = (prediction: Prediction) => {
    const indicators = [
      {
        key: "pregnancies",
        label: t("dashboard.pregnancies"),
        value: prediction.pregnancies,
      },
      {
        key: "glucose",
        label: t("dashboard.glucose"),
        value: prediction.glucose,
      },
      {
        key: "blood_pressure",
        label: t("dashboard.bloodPressure"),
        value: prediction.blood_pressure,
      },
      {
        key: "skin_thickness",
        label: t("dashboard.skinThickness"),
        value: prediction.skin_thickness,
      },
      {
        key: "insulin",
        label: t("dashboard.insulin"),
        value: prediction.insulin,
      },
      {
        key: "bmi",
        label: t("dashboard.bmi"),
        value: Number(prediction.bmi),
      },
      {
        key: "diabetes_pedigree_function",
        label: t("dashboard.diabetesPedigree"),
        value: Number(prediction.diabetes_pedigree_function),
      },
      {
        key: "age",
        label: t("dashboard.age"),
        value: prediction.age,
      },
    ];

    return indicators.sort((a, b) => b.value - a.value).slice(0, 3);
  };

  const latestPrediction = predictions[0];

  const latestRiskTextColor = useMemo(() => {
    if (!latestPrediction) return "text-foreground";
    return getRiskTextClass(latestPrediction.risk_level);
  }, [latestPrediction]);

  const averageRisk = useMemo(() => {
    if (!predictions.length) return 0;

    const total = predictions.reduce((sum, pred) => sum + pred.probability, 0);

    return total / predictions.length;
  }, [predictions]);

  const rangePredictions = useMemo(() => {
    if (!selectedRange) return [];

    const now = new Date();
    const days = selectedRange === "weekly" ? 7 : 30;

    const startDate = new Date(now);
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(now.getDate() - days);

    return [...predictions]
      .filter(
        (pred) => new Date(pred.created_at).getTime() >= startDate.getTime()
      )
      .sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
  }, [predictions, selectedRange]);

  const filteredRecentPredictions = useMemo(() => {
    if (!selectedRange) return [];

    const query = normalizeSearchText(searchTerm);
    const visiblePredictions = [...rangePredictions]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 3);

    if (!query) return visiblePredictions;

    return visiblePredictions.filter((pred) => {
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
  }, [rangePredictions, searchTerm, isArabic, selectedRange]);

  const rangeAverageRisk = useMemo(() => {
    if (!rangePredictions.length) return 0;

    const total = rangePredictions.reduce(
      (sum, pred) => sum + pred.probability,
      0
    );

    return total / rangePredictions.length;
  }, [rangePredictions]);

  const highestRangeRisk = useMemo(() => {
    if (!rangePredictions.length) return null;

    return [...rangePredictions].sort((a, b) => b.probability - a.probability)[0];
  }, [rangePredictions]);

  const trendChartData = useMemo(() => {
    if (!rangePredictions.length) return [];

    return rangePredictions.map((item, index) => ({
      index: index + 1,
      dateLabel: new Date(item.created_at).toLocaleDateString(
        isArabic ? "ar-SA" : "en-US",
        selectedRange === "weekly"
          ? { month: "numeric", day: "numeric" }
          : { month: "short", day: "numeric" }
      ),
      probability: Number(item.probability.toFixed(2)),
      fullDate: new Date(item.created_at).toLocaleString(
        isArabic ? "ar-SA" : "en-US",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      ),
      riskLevel: getLocalizedRiskLabel(item.risk_level),
    }));
  }, [rangePredictions, isArabic, selectedRange]);

  const vitalsChartData = useMemo(() => {
    if (!latestPrediction) return [];

    return [
      {
        label: t("dashboard.chartShortPregnancies"),
        fullLabel: t("dashboard.pregnancies"),
        value: latestPrediction.pregnancies,
      },
      {
        label: t("dashboard.chartShortGlucose"),
        fullLabel: t("dashboard.glucose"),
        value: latestPrediction.glucose,
      },
      {
        label: t("dashboard.chartShortBloodPressure"),
        fullLabel: t("dashboard.bloodPressure"),
        value: latestPrediction.blood_pressure,
      },
      {
        label: t("dashboard.chartShortSkinThickness"),
        fullLabel: t("dashboard.skinThickness"),
        value: latestPrediction.skin_thickness,
      },
      {
        label: t("dashboard.chartShortInsulin"),
        fullLabel: t("dashboard.insulin"),
        value: latestPrediction.insulin,
      },
      {
        label: t("dashboard.chartShortBmi"),
        fullLabel: t("dashboard.bmi"),
        value: Number(latestPrediction.bmi),
      },
      {
        label: t("dashboard.chartShortDiabetesPedigree"),
        fullLabel: t("dashboard.diabetesPedigree"),
        value: Number(latestPrediction.diabetes_pedigree_function),
      },
      {
        label: t("dashboard.chartShortAge"),
        fullLabel: t("dashboard.age"),
        value: latestPrediction.age,
      },
    ];
  }, [latestPrediction, t]);

  const chartStrokeColor = useMemo(() => {
    if (!latestPrediction) return "#10b981";

    const normalized = normalizeRiskLevel(latestPrediction.risk_level);

    if (normalized === "high") return "#ef4444";
    if (normalized === "medium") return "#eab308";
    return "#10b981";
  }, [latestPrediction]);

  const navItemClass =
    "flex items-center gap-3 rounded-xl px-3 py-3 text-sm hover:bg-accent transition-colors";
  const navIconClass = "h-5 w-5 text-muted-foreground";

  const desktopSidebarSideClass = isArabic
    ? "right-0 border-l"
    : "left-0 border-r";

  const desktopContentOffsetClass = isArabic
    ? isDesktopSidebarCollapsed
      ? "xl:pr-[88px]"
      : "xl:pr-[260px]"
    : isDesktopSidebarCollapsed
    ? "xl:pl-[88px]"
    : "xl:pl-[260px]";

  const sidebarToggleIcon = isArabic ? (
    isDesktopSidebarCollapsed ? (
      <ChevronLeft className="h-4 w-4" />
    ) : (
      <ChevronRight className="h-4 w-4" />
    )
  ) : isDesktopSidebarCollapsed ? (
    <ChevronRight className="h-4 w-4" />
  ) : (
    <ChevronLeft className="h-4 w-4" />
  );

  const sidebarContent = (
    <div className="flex h-full flex-col pt-6">
      <div
        className={`flex items-center pb-5 ${
          isDesktopSidebarCollapsed ? "justify-center" : "justify-between gap-3"
        }`}
      >
        {!isDesktopSidebarCollapsed && (
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-full overflow-hidden bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center shrink-0">
              {user?.profile_picture ? (
                <img
                  src={user.profile_picture}
                  alt={user?.first_name || user?.email || "Profile"}
                  className="w-full h-full object-cover"
                  loading="lazy"
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
        )}

        <button
          type="button"
          onClick={() => setIsDesktopSidebarCollapsed((prev) => !prev)}
          className={`hidden xl:flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border bg-background text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-foreground ${
            isDesktopSidebarCollapsed ? "mx-auto" : ""
          }`}
          aria-label={
            isDesktopSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
          }
          title={
            isDesktopSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
          }
        >
          {sidebarToggleIcon}
        </button>
      </div>

      <div className="border-t pt-5">
        <div className="space-y-1.5">
          <div
            className={`rounded-xl bg-primary/10 text-primary px-3 py-3 text-sm font-medium ${
              isDesktopSidebarCollapsed
                ? "flex items-center justify-center"
                : "flex items-center gap-3"
            }`}
            title={isDesktopSidebarCollapsed ? t("dashboard.title") : undefined}
          >
            <LayoutDashboard className="h-5 w-5 shrink-0" />
            {!isDesktopSidebarCollapsed && <span>{t("dashboard.title")}</span>}
          </div>

          <Link to="/diagnosis" className="block">
            <div
              className={`${navItemClass} ${
                isDesktopSidebarCollapsed ? "justify-center px-2" : ""
              }`}
              title={
                isDesktopSidebarCollapsed ? t("dashboard.newCheckup") : undefined
              }
            >
              <Beaker className={navIconClass} />
              {!isDesktopSidebarCollapsed && (
                <span>{t("dashboard.newCheckup")}</span>
              )}
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
            <div
              className={`${navItemClass} ${
                isDesktopSidebarCollapsed ? "justify-center px-2" : ""
              }`}
              title={
                isDesktopSidebarCollapsed
                  ? t("dashboard.previousReports")
                  : undefined
              }
            >
              <FileText className={navIconClass} />
              {!isDesktopSidebarCollapsed && (
                <span>{t("dashboard.previousReports")}</span>
              )}
            </div>
          </Link>

          <Link to="/consultations" className="block">
            <div
              className={`${navItemClass} ${
                isDesktopSidebarCollapsed ? "justify-center px-2" : ""
              }`}
              title={
                isDesktopSidebarCollapsed
                  ? t("dashboard.bookConsultation")
                  : undefined
              }
            >
              <Calendar className={navIconClass} />
              {!isDesktopSidebarCollapsed && (
                <span>{t("dashboard.bookConsultation")}</span>
              )}
            </div>
          </Link>
        </div>
      </div>

      <div className="mt-auto pt-6 border-t">
        <div className="space-y-1.5">
          <Link to="/edit-profile" className="block">
            <div
              className={`${navItemClass} ${
                isDesktopSidebarCollapsed ? "justify-center px-2" : ""
              }`}
              title={
                isDesktopSidebarCollapsed ? t("dashboard.settings") : undefined
              }
            >
              <Settings className={navIconClass} />
              {!isDesktopSidebarCollapsed && (
                <span>{t("dashboard.settings")}</span>
              )}
            </div>
          </Link>

          <Link to="/help" className="block">
            <div
              className={`${navItemClass} ${
                isDesktopSidebarCollapsed ? "justify-center px-2" : ""
              }`}
              title={isDesktopSidebarCollapsed ? t("dashboard.help") : undefined}
            >
              <CircleHelp className={navIconClass} />
              {!isDesktopSidebarCollapsed && <span>{t("dashboard.help")}</span>}
            </div>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className={`flex w-full rounded-xl py-3 text-sm text-red-600 hover:bg-red-500/10 transition-colors ${
              isDesktopSidebarCollapsed
                ? "items-center justify-center px-2"
                : "items-center gap-3 px-3"
            }`}
            title={isDesktopSidebarCollapsed ? t("dashboard.logout") : undefined}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!isDesktopSidebarCollapsed && <span>{t("dashboard.logout")}</span>}
          </button>
        </div>
      </div>
    </div>
  );

  const displayedPredictions = selectedRange
    ? filteredRecentPredictions
    : predictions.slice(0, 3);

  return (
    <div
      className="min-h-screen flex flex-col bg-background overflow-x-hidden"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <Header variant="dashboard" />

      <main
        className="flex-1 w-full max-w-none overflow-x-hidden px-4 sm:px-5 lg:px-6 pb-6"
        style={{ paddingTop: `${DESKTOP_HEADER_HEIGHT}px` }}
      >
        <div className="relative w-full max-w-none">
          <div className="xl:hidden">
            <button
              type="button"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="mb-4 mt-4 flex items-center justify-center rounded-xl border bg-card px-4 py-3 shadow-sm"
              aria-label="Toggle sidebar"
            >
              <ChevronDown
                className={`h-5 w-5 transition-transform duration-200 ${
                  isSidebarOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`overflow-hidden transition-[max-height,opacity,margin] duration-200 ease-out ${
                isSidebarOpen
                  ? "max-h-[900px] opacity-100 mb-4"
                  : "max-h-0 opacity-0"
              }`}
            >
              <Card className="rounded-[24px] border bg-card p-4 shadow-sm">
                {sidebarContent}
              </Card>
            </div>
          </div>

          <aside
            className={`hidden xl:block fixed z-30 bg-background ${desktopSidebarSideClass} transition-[width] duration-200`}
            style={{
              top: `${DESKTOP_HEADER_HEIGHT}px`,
              bottom: 0,
              width: `${
                isDesktopSidebarCollapsed
                  ? DESKTOP_SIDEBAR_COLLAPSED_WIDTH
                  : DESKTOP_SIDEBAR_WIDTH
              }px`,
            }}
          >
            <div
              className={`h-full overflow-y-auto transition-[padding] duration-200 ${
                isDesktopSidebarCollapsed ? "px-2" : "px-4"
              }`}
            >
              {sidebarContent}
            </div>
          </aside>

          <div
            className={`w-full min-w-0 space-y-5 transition-[padding] duration-200 ${desktopContentOffsetClass}`}
          >
            <div
              ref={heroRef}
              className={`flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between pt-6 transform-gpu transition-opacity transition-transform duration-500 ease-out ${
                heroVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              <div className={isArabic ? "text-right" : "text-left"}>
                <h1 className="text-2xl lg:text-[26px] font-semibold">
                  {t("dashboard.title")}
                </h1>
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
              className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 transform-gpu transition-opacity transition-transform duration-500 ease-out ${
                statsVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
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
                  {predictions.length
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
                  {formatNumber(predictions.length)}
                </h3>
              </Card>

              <Card className="rounded-[20px] border bg-card p-5 shadow-sm">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Clock3 className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {t("dashboard.lastCheckup")}
                </p>
                {latestPrediction ? (
                  <div>
                    <h3 className="text-2xl font-bold">
                      {formatDate(latestPrediction.created_at)}
                    </h3>
                  </div>
                ) : (
                  <h3 className="text-2xl font-bold">--</h3>
                )}
              </Card>
            </section>

            <section
              ref={analysesRef}
              className={`grid grid-cols-1 gap-5 items-start transform-gpu transition-opacity transition-transform duration-500 ease-out ${
                analysesVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
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

                  <div className="flex items-center gap-2 flex-wrap">
                    {predictions.length > 3 && !selectedRange && (
                      <Link to="/past-reports">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl"
                        >
                          {t("dashboard.allReports")}
                        </Button>
                      </Link>
                    )}

                    <Button
                      variant={selectedRange === "weekly" ? "default" : "outline"}
                      size="sm"
                      className="rounded-xl"
                      onClick={() =>
                        setSelectedRange((prev) =>
                          prev === "weekly" ? null : "weekly"
                        )
                      }
                    >
                      {t("dashboard.weekly")}
                    </Button>

                    <Button
                      variant={selectedRange === "monthly" ? "default" : "outline"}
                      size="sm"
                      className="rounded-xl"
                      onClick={() =>
                        setSelectedRange((prev) =>
                          prev === "monthly" ? null : "monthly"
                        )
                      }
                    >
                      {t("dashboard.monthly")}
                    </Button>
                  </div>
                </div>

                {selectedRange && (
                  <div className="rounded-[22px] border bg-gradient-to-b from-primary/5 via-background to-background p-5 mb-5">
                    <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_.8fr] gap-5 items-start">
                      <div className="rounded-[22px] border bg-card p-4 md:p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <TrendingUp className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">
                              {selectedRange === "weekly"
                                ? t("dashboard.weekly")
                                : t("dashboard.monthly")}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {selectedRange === "weekly"
                                ? t("dashboard.last7Days")
                                : t("dashboard.last30Days")}
                            </p>
                          </div>
                        </div>

                        {trendChartData.length > 0 ? (
                          <div className="h-[320px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart
                                data={trendChartData}
                                margin={{
                                  top: 10,
                                  right: 10,
                                  left: 0,
                                  bottom: 10,
                                }}
                              >
                                <CartesianGrid
                                  strokeDasharray="4 4"
                                  vertical={false}
                                  stroke="hsl(var(--border))"
                                />
                                <XAxis
                                  dataKey="dateLabel"
                                  tickLine={false}
                                  axisLine={false}
                                  tickMargin={10}
                                  tick={{
                                    fontSize: 11,
                                    fill: "hsl(var(--muted-foreground))",
                                  }}
                                />
                                <YAxis
                                  tickLine={false}
                                  axisLine={false}
                                  domain={[0, 100]}
                                  tick={{
                                    fontSize: 12,
                                    fill: "hsl(var(--muted-foreground))",
                                  }}
                                />
                                <Tooltip
                                  cursor={{
                                    stroke: "hsl(var(--border))",
                                    strokeDasharray: "4 4",
                                  }}
                                  contentStyle={{
                                    borderRadius: "14px",
                                    border: "1px solid hsl(var(--border))",
                                    background: "hsl(var(--card))",
                                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                                  }}
                                  formatter={(value: number) => [
                                    `${value}%`,
                                    t("dashboard.riskTooltip"),
                                  ]}
                                  labelFormatter={(_, payload) =>
                                    payload?.[0]?.payload?.fullDate || ""
                                  }
                                />
                                <Line
                                  type="monotone"
                                  dataKey="probability"
                                  stroke="hsl(var(--primary))"
                                  strokeWidth={3}
                                  isAnimationActive={false}
                                  dot={{
                                    r: 4,
                                    strokeWidth: 2,
                                    fill: "hsl(var(--background))",
                                    stroke: "hsl(var(--primary))",
                                  }}
                                  activeDot={{
                                    r: 6,
                                    strokeWidth: 2,
                                    fill: "hsl(var(--background))",
                                    stroke: "hsl(var(--primary))",
                                  }}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        ) : (
                          <div className="h-[320px] rounded-2xl border border-dashed bg-muted/20 flex items-center justify-center text-center px-6">
                            <div>
                              <BarChart3 className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                              <p className="font-medium mb-1">
                                {selectedRange === "weekly"
                                  ? t("dashboard.noWeeklyReportsTitle")
                                  : t("dashboard.noMonthlyReportsTitle")}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {selectedRange === "weekly"
                                  ? t("dashboard.noWeeklyReportsDesc")
                                  : t("dashboard.noMonthlyReportsDesc")}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <Card className="rounded-[22px] border bg-card p-4 shadow-none">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                              <Activity className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                {selectedRange === "weekly"
                                  ? t("dashboard.weeklyAverage")
                                  : t("dashboard.monthlyAverage")}
                              </p>
                              <h4 className="text-2xl font-bold">
                                {rangePredictions.length
                                  ? `${formatNumber(rangeAverageRisk, {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}%`
                                  : "--"}
                              </h4>
                            </div>
                          </div>
                        </Card>

                        <Card className="rounded-[22px] border bg-card p-4 shadow-none">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                              <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                {selectedRange === "weekly"
                                  ? t("dashboard.reportsThisWeek")
                                  : t("dashboard.reportsThisMonth")}
                              </p>
                              <h4 className="text-2xl font-bold">
                                {formatNumber(rangePredictions.length)}
                              </h4>
                            </div>
                          </div>
                        </Card>

                        <Card className="rounded-[22px] border bg-card p-4 shadow-none">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                              <ShieldCheck className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                {selectedRange === "weekly"
                                  ? t("dashboard.highestWeeklyRisk")
                                  : t("dashboard.highestMonthlyRisk")}
                              </p>
                              <h4 className="text-2xl font-bold">
                                {highestRangeRisk
                                  ? `${formatNumber(highestRangeRisk.probability, {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}%`
                                  : "--"}
                              </h4>
                            </div>
                          </div>

                          {highestRangeRisk && (
                            <Badge
                              className={`border text-xs transition-none ${getRiskBadgeColor(
                                highestRangeRisk.risk_level
                              )}`}
                            >
                              {getLocalizedRiskLabel(highestRangeRisk.risk_level)}
                            </Badge>
                          )}
                        </Card>
                      </div>
                    </div>
                  </div>
                )}

                <div className="rounded-[22px] border bg-gradient-to-b from-primary/5 via-background to-background p-5 mb-5">
                  <div className="space-y-5">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {t("dashboard.latestAnalysisScore")}
                        </p>

                        <div className="flex items-center gap-3 flex-wrap">
                          <h2 className="text-4xl font-bold">
                            {latestPrediction
                              ? `${formatNumber(latestPrediction.probability, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}%`
                              : "--"}
                          </h2>

                          {latestPrediction && (
                            <Badge
                              className={`border text-xs transition-none ${getRiskBadgeColor(
                                latestPrediction.risk_level
                              )}`}
                            >
                              {getLocalizedRiskLabel(latestPrediction.risk_level)}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className={isArabic ? "md:text-left" : "md:text-right"}>
                        <p className="text-sm text-muted-foreground mb-2">
                          {t("dashboard.recentAnalyses")}
                        </p>
                        <p className="text-2xl font-bold text-primary">
                          {selectedRange
                            ? formatNumber(rangePredictions.length)
                            : latestPrediction
                            ? "1"
                            : "0"}
                        </p>
                      </div>
                    </div>

                    {vitalsChartData.length > 0 ? (
                      <div className="rounded-[22px] border bg-card p-4 md:p-5">
                        <div className="w-full overflow-x-auto">
                          <div className="min-w-[720px] h-[340px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart
                                data={vitalsChartData}
                                margin={{
                                  top: 20,
                                  right: 20,
                                  left: 10,
                                  bottom: 20,
                                }}
                              >
                                <CartesianGrid
                                  strokeDasharray="4 4"
                                  vertical={false}
                                  stroke="hsl(var(--border))"
                                />
                                <XAxis
                                  dataKey="label"
                                  tickLine={false}
                                  axisLine={false}
                                  interval={0}
                                  height={40}
                                  tickMargin={10}
                                  tick={{
                                    fontSize: 11,
                                    fill: "hsl(var(--muted-foreground))",
                                  }}
                                />
                                <YAxis
                                  tickLine={false}
                                  axisLine={false}
                                  tick={{
                                    fontSize: 12,
                                    fill: "hsl(var(--muted-foreground))",
                                  }}
                                />
                                <Tooltip
                                  cursor={{
                                    stroke: "hsl(var(--border))",
                                    strokeDasharray: "4 4",
                                  }}
                                  contentStyle={{
                                    borderRadius: "14px",
                                    border: "1px solid hsl(var(--border))",
                                    background: "hsl(var(--card))",
                                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                                  }}
                                  formatter={(value: number) => [
                                    value,
                                    t("dashboard.valueLabel"),
                                  ]}
                                  labelFormatter={(_, payload) =>
                                    payload?.[0]?.payload?.fullLabel || ""
                                  }
                                />
                                <Line
                                  type="monotone"
                                  dataKey="value"
                                  stroke={chartStrokeColor}
                                  strokeWidth={4}
                                  isAnimationActive={false}
                                  dot={{
                                    r: 4,
                                    strokeWidth: 2,
                                    fill: "hsl(var(--background))",
                                    stroke: chartStrokeColor,
                                  }}
                                  activeDot={{
                                    r: 6,
                                    strokeWidth: 2,
                                    fill: "hsl(var(--background))",
                                    stroke: chartStrokeColor,
                                  }}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed bg-muted/20 p-6 text-center text-sm text-muted-foreground">
                        {t("dashboard.noData")}
                      </div>
                    )}
                  </div>
                </div>

                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="rounded-2xl border p-4">
                        <div className="h-4 w-48 bg-muted rounded mb-3" />
                        <div className="h-3 w-32 bg-muted rounded mb-2" />
                        <div className="h-3 w-24 bg-muted rounded" />
                      </div>
                    ))}
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
                ) : selectedRange && filteredRecentPredictions.length === 0 ? (
                  <div className="rounded-2xl border border-dashed p-10 text-center bg-muted/20">
                    <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Search className="h-7 w-7 text-primary" />
                    </div>
                    <h4 className="text-lg font-semibold mb-2">
                      {selectedRange === "weekly"
                        ? t("dashboard.noWeeklyReportsTitle")
                        : t("dashboard.noMonthlyReportsTitle")}
                    </h4>
                    <p className="text-muted-foreground">
                      {selectedRange === "weekly"
                        ? t("dashboard.noWeeklyReportsDesc")
                        : t("dashboard.noMonthlyReportsDesc")}
                    </p>
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
                ) : (
                  <>
                    <div className="hidden lg:block overflow-x-auto">
                      <div className="min-w-[1080px] overflow-hidden rounded-[22px] border">
                        <div className="grid grid-cols-[2fr_1.45fr_1.05fr_1.1fr] gap-4 bg-muted/30 px-5 py-4 text-sm font-semibold text-muted-foreground">
                          <span className="text-start">
                            {t("dashboard.recentAnalyses")}
                          </span>
                          <span className="text-start">
                            {t("dashboard.riskIndicators")}
                          </span>
                          <span className="text-start whitespace-nowrap">
                            {t("dashboard.date")}
                          </span>
                          <span
                            className={`whitespace-nowrap ${
                              isArabic ? "text-left" : "text-right"
                            }`}
                          >
                            {t("dashboard.action")}
                          </span>
                        </div>

                        {displayedPredictions.map((pred) => {
                          const topIndicators = getTopRiskIndicators(pred);

                          return (
                            <div
                              key={pred.id}
                              className="grid grid-cols-[2fr_1.45fr_1.05fr_1.1fr] gap-4 items-center px-5 py-5 border-t hover:bg-muted/10"
                            >
                              <div className="min-w-0">
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                    <Activity className="h-5 w-5 text-primary" />
                                  </div>

                                  <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <p className="font-semibold truncate">
                                        {t("dashboard.infectionProbability")}:{" "}
                                        {formatNumber(pred.probability, {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                        })}
                                        %
                                      </p>

                                      <Badge
                                        className={`border text-xs transition-none ${getRiskBadgeColor(
                                          pred.risk_level
                                        )}`}
                                      >
                                        {getLocalizedRiskLabel(pred.risk_level)}
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
                                  {formatDate(pred.created_at)}
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground whitespace-nowrap">
                                  {formatTime(pred.created_at)}
                                </p>
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
                                  <Button
                                    variant="ghost"
                                    className="rounded-xl whitespace-nowrap h-10"
                                  >
                                    {t("dashboard.viewReport")}
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid gap-4 lg:hidden">
                      {displayedPredictions.map((pred) => {
                        const topIndicators = getTopRiskIndicators(pred);

                        return (
                          <div
                            key={pred.id}
                            className="rounded-[20px] border p-4 bg-background"
                          >
                            <div className="flex items-start gap-3">
                              <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                <Activity className="h-5 w-5 text-primary" />
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="font-semibold leading-snug">
                                    {t("dashboard.infectionProbability")}:{" "}
                                    {formatNumber(pred.probability, {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}
                                    %
                                  </p>

                                  <Badge
                                    className={`border text-xs transition-none ${getRiskBadgeColor(
                                      pred.risk_level
                                    )}`}
                                  >
                                    {getLocalizedRiskLabel(pred.risk_level)}
                                  </Badge>
                                </div>

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
                                    {t("dashboard.date")}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {formatDate(pred.created_at)}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {formatTime(pred.created_at)}
                                  </p>
                                </div>

                                <div className="mt-4 rounded-xl bg-muted/30 p-3">
                                  <p className="text-xs text-muted-foreground mb-2">
                                    {t("dashboard.action")}
                                  </p>

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
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      className="rounded-xl w-full h-10"
                                    >
                                      {t("dashboard.viewReport")}
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </Card>
            </section>

            <section
              ref={doctorRef}
              className={`grid grid-cols-1 gap-5 items-start transform-gpu transition-opacity transition-transform duration-500 ease-out ${
                doctorVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
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