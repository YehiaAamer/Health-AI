import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

const Activity = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
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
  return (
    <header className="w-full border-b bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/home" className="flex items-center gap-2">
          <Activity className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">HealthAI</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {variant === "auth" ? (
            <Link
              to="/home"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Home
            </Link>
          ) : variant === "dashboard" ? (
            <>
              <Link
                to="/dashboard"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/report"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Reports
              </Link>
              <Link
                to="/consultations"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Consultations
              </Link>
              <Link
                to="/help"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Help
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/home"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Home
              </Link>
              <Link
                to="/help"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                FAQs
              </Link>
              <Link
                to="/help"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Contact
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {variant === "dashboard" ? (
            <>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-cyan-600 rounded-full" />
            </>
          ) : variant === "auth" ? null : (
            <>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/signup">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;