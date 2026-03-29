import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bell, User, Settings, LogOut, Globe } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const Activity = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M3 12h4l3-9 4 18 3-9h4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface HeaderProps {
  variant?: "default" | "auth" | "dashboard";
}

const Header = ({ variant = "default" }: HeaderProps) => {
  const { user, logout, isLoading } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isArabic = i18n.language.startsWith("ar");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    setMenuOpen(false);
    try {
      await logout();
    } finally {
      navigate("/auth?tab=login");
    }
  };

  const handleToggleLanguage = async () => {
    const newLang = isArabic ? "en" : "ar";
    await i18n.changeLanguage(newLang);
    setMenuOpen(false);
  };

  const renderUserMenu = () => (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setMenuOpen((prev) => !prev)}
        className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center hover:scale-105 transition"
      >
        {user?.profile_picture ? (
          <img
            src={user.profile_picture}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="h-5 w-5 text-white" />
        )}
      </button>

      {menuOpen && (
        <div
          className="absolute top-full right-0 mt-2 w-56 min-w-[14rem] rounded-xl border bg-background shadow-lg z-50 overflow-hidden origin-top-right"
          dir={isArabic ? "rtl" : "ltr"}
        >
          {/* User Info */}
          <div
            className={`px-4 py-3 border-b ${
              isArabic ? "text-right" : "text-left"
            }`}
          >
            <p className="font-semibold text-sm truncate">
              {user?.first_name
                ? `${user.first_name} ${user?.last_name || ""}`
                : t("myAccount")}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email || ""}
            </p>
          </div>

          {/* Settings */}
          <button
            onClick={() => {
              setMenuOpen(false);
              navigate("/edit-profile");
            }}
            className={`w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-accent ${
              isArabic ? "flex-row-reverse text-right" : "text-left"
            }`}
          >
            <Settings className="h-4 w-4" />
            {t("settings")}
          </button>

          {/* Language */}
          <button
            onClick={handleToggleLanguage}
            className={`w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-accent ${
              isArabic ? "flex-row-reverse text-right" : "text-left"
            }`}
          >
            <Globe className="h-4 w-4" />
            {isArabic ? "English" : "العربية"}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-accent ${
              isArabic ? "flex-row-reverse text-right" : "text-left"
            }`}
          >
            <LogOut className="h-4 w-4" />
            {t("logout")}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <header className="w-full border-b bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-4" dir="ltr">
          
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">HealthAI</span>
          </Link>

          {/* NAVBAR */}
          <nav className="hidden md:flex flex-1 justify-center gap-6">
            {variant === "auth" ? (
              <Link to="/home">{t("home")}</Link>
            ) : user ? (
              <>
                <Link to="/home">{t("home")}</Link>
                <Link to="/dashboard">{t("dashboard.title")}</Link>
                <Link to="/past-reports">{t("reports")}</Link>
                <Link to="/consultations">{t("consultations")}</Link>
                <Link to="/help">{t("helpNav")}</Link>
              </>
            ) : (
              <>
                <Link to="/home">{t("home")}</Link>
                <Link to="/help">{t("helpNav")}</Link>
                <Link to="/contact">{t("contact")}</Link>
              </>
            )}
          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-2 ms-auto">
            
            <Button variant="ghost" size="icon" onClick={handleToggleLanguage}>
              <Globe className="h-5 w-5" />
            </Button>

            {user ? (
              <>
                {/* 🔔 النوتيفيكيشن ثابتة هنا */}
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>

                {renderUserMenu()}
              </>
            ) : (
              !isLoading && (
                <>
                  <Link to="/login">
                    <Button variant="ghost">{t("login")}</Button>
                  </Link>
                  <Link to="/signup">
                    <Button>{t("getStarted")}</Button>
                  </Link>
                </>
              )
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;