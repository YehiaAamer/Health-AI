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

  const closeMobileNav = () => setMobileNavOpen(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "relative whitespace-nowrap transition-colors duration-200",
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
        <NavLink
          to="/home"
          className={cls}
          onClick={mobile ? closeMobileNav : undefined}
        >
          {t("home")}
        </NavLink>
      );
    }

    if (user) {
      return (
        <>
          <NavLink
            to="/home"
            className={cls}
            onClick={mobile ? closeMobileNav : undefined}
          >
            {t("home")}
          </NavLink>
          <NavLink
            to="/dashboard"
            className={cls}
            onClick={mobile ? closeMobileNav : undefined}
          >
            {t("dashboard.title")}
          </NavLink>
          <NavLink
            to="/past-reports"
            className={cls}
            onClick={mobile ? closeMobileNav : undefined}
          >
            {t("reports")}
          </NavLink>
          <NavLink
            to="/consultations"
            className={cls}
            onClick={mobile ? closeMobileNav : undefined}
          >
            {t("consultations")}
          </NavLink>
          <NavLink
            to="/help"
            className={cls}
            onClick={mobile ? closeMobileNav : undefined}
          >
            {t("helpNav")}
          </NavLink>
        </>
      );
    }

    return (
      <>
        <NavLink
          to="/home"
          className={cls}
          onClick={mobile ? closeMobileNav : undefined}
        >
          {t("home")}
        </NavLink>
        <NavLink
          to="/help"
          className={cls}
          onClick={mobile ? closeMobileNav : undefined}
        >
          {t("helpNav")}
        </NavLink>
        <NavLink
          to="/contact"
          className={cls}
          onClick={mobile ? closeMobileNav : undefined}
        >
          {t("contact")}
        </NavLink>
      </>
    );
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
          className={`absolute top-full mt-2 w-56 min-w-[14rem] rounded-xl border bg-background shadow-lg z-[60] overflow-hidden ${
            isArabic ? "left-0 origin-top-left" : "right-0 origin-top-right"
          }`}
          dir={isArabic ? "rtl" : "ltr"}
        >
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

          <button
            onClick={handleToggleLanguage}
            className={`w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-accent ${
              isArabic ? "flex-row-reverse text-right" : "text-left"
            }`}
          >
            <Globe className="h-4 w-4" />
            {isArabic ? "English" : "العربية"}
          </button>

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
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <div className="w-full max-w-none px-4 sm:px-5 lg:px-6 h-[72px]">
          <div className="flex h-full w-full min-w-0 items-center justify-between gap-4 md:grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center">
            <div className="min-w-0 md:justify-self-start">
              <Link to="/home" className="flex items-center gap-2 w-fit">
                <Activity className="h-8 w-8 text-primary shrink-0" />
                <span className="text-xl font-bold whitespace-nowrap">
                  HealthAI
                </span>
              </Link>
            </div>

            <nav
              className={`hidden md:flex min-w-0 items-center justify-center gap-6 md:justify-self-center ${
                isArabic ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {renderMainLinks(false)}
            </nav>

            <div className="flex min-w-0 items-center gap-2 shrink-0 md:justify-self-end">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileNavOpen(true)}
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggleLanguage}
              >
                <Globe className="h-5 w-5" />
              </Button>

              {user ? (
                <>
                  <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                  </Button>
                  {renderUserMenu()}
                </>
              ) : (
                !isLoading && (
                  <div className="hidden md:flex items-center gap-2">
                    <Link to="/login">
                      <Button variant="ghost">{t("login")}</Button>
                    </Link>
                    <Link to="/signup">
                      <Button>{t("getStarted")}</Button>
                    </Link>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </header>

      {mobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-[100]">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeMobileNav}
          />

          <div
            dir={isArabic ? "rtl" : "ltr"}
            className={`absolute top-0 h-full w-[280px] bg-background shadow-2xl border-l border-r transition-all duration-300 ${
              isArabic ? "left-0" : "right-0"
            }`}
          >
            <div className="flex items-center justify-between px-4 py-4 border-b">
              <div className="flex items-center gap-2">
                <Activity className="h-7 w-7 text-primary" />
                <span className="text-lg font-bold">HealthAI</span>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={closeMobileNav}
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="px-3 py-4 space-y-2">
              {renderMainLinks(true)}

              {!user && !isLoading && (
                <div className="pt-3 space-y-2">
                  <Link to="/login" onClick={closeMobileNav}>
                    <Button variant="ghost" className="w-full">
                      {t("login")}
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={closeMobileNav}>
                    <Button className="w-full">{t("getStarted")}</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;