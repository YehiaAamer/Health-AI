import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bell, User, Settings, LogOut, Globe, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const Activity = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileNavOpen(false);
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogout = async () => {
    setMenuOpen(false);
    setMobileNavOpen(false);
    setIsLoggingOut(true);

    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
      navigate("/auth?tab=login");
    }
  };

  const handleToggleLanguage = async () => {
    const newLang = isArabic ? "en" : "ar";
    await i18n.changeLanguage(newLang);
    setMenuOpen(false);
  };

  const closeMobileNav = () => setMobileNavOpen(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "relative transition-colors duration-200",
      "after:absolute after:start-0 after:-bottom-1.5 after:h-[2px] after:rounded-full after:bg-primary after:transition-all after:duration-200",
      isActive
        ? "text-primary font-medium after:w-full"
        : "text-foreground/80 hover:text-foreground after:w-0 hover:after:w-full",
    ].join(" ");

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "block rounded-xl px-4 py-3 text-sm transition-colors duration-200",
      isActive
        ? "bg-primary/10 text-primary font-medium"
        : "text-foreground hover:bg-accent",
      isArabic ? "text-right" : "text-left",
    ].join(" ");

  const renderMainLinks = (mobile = false) => {
    const cls = mobile ? mobileNavLinkClass : navLinkClass;

    if (variant === "auth") {
      return (
        <NavLink to="/home" className={cls}>
          {t("home")}
        </NavLink>
      );
    }

    if (user) {
      return (
        <>
          <NavLink to="/home" className={cls}>{t("home")}</NavLink>
          <NavLink to="/dashboard" className={cls}>{t("dashboard.title")}</NavLink>
          <NavLink to="/past-reports" className={cls}>{t("reports")}</NavLink>
          <NavLink to="/consultations" className={cls}>{t("consultations")}</NavLink>
          <NavLink to="/help" className={cls}>{t("helpNav")}</NavLink>
        </>
      );
    }

    return (
      <>
        <NavLink to="/home" className={cls}>{t("home")}</NavLink>
        <NavLink to="/help" className={cls}>{t("helpNav")}</NavLink>
        <NavLink to="/contact" className={cls}>{t("contact")}</NavLink>
      </>
    );
  };

  const renderUserMenu = () => (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setMenuOpen((prev) => !prev)}
        className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center"
      >
        {user?.profile_picture ? (
          <img src={user.profile_picture} className="w-full h-full object-cover" />
        ) : (
          <User className="h-5 w-5 text-white" />
        )}
      </button>

      {menuOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border bg-background shadow-lg z-50">
          <button onClick={() => navigate("/edit-profile")} className="w-full px-4 py-3 flex gap-2">
            <Settings className="h-4 w-4" />
            {t("settings")}
          </button>

          <button onClick={handleToggleLanguage} className="w-full px-4 py-3 flex gap-2">
            <Globe className="h-4 w-4" />
            {isArabic ? "English" : "العربية"}
          </button>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full px-4 py-3 flex gap-2 text-red-600"
          >
            <LogOut className="h-4 w-4" />
            {isLoggingOut ? "Logging out..." : t("logout")}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      <header className="w-full border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/home" className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">HealthAI</span>
          </Link>

          <nav className="hidden md:flex gap-6">
            {renderMainLinks()}
          </nav>

          <div className="flex items-center gap-2">
            <Button className="md:hidden" onClick={() => setMobileNavOpen(true)}>
              <Menu />
            </Button>

            <Button onClick={handleToggleLanguage}>
              <Globe />
            </Button>

            {user ? (
              <>
                <Bell />
                {renderUserMenu()}
              </>
            ) : (
              !isLoading && (
                <>
                  <Link to="/login"><Button>{t("login")}</Button></Link>
                  <Link to="/signup"><Button>{t("getStarted")}</Button></Link>
                </>
              )
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
