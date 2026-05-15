import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  MessageSquare,
  Settings,
  HelpCircle,
  Menu,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DoctorSidebarProps {
  className?: string;
}

export default function DoctorSidebar({ className }: DoctorSidebarProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => setCollapsed(!collapsed);

  const navItems = [
    { icon: LayoutDashboard, label: t('doctorDashboard.sidebar.overview'), path: '/doctor-dashboard' },
    { icon: Users, label: t('doctorDashboard.sidebar.patients'), path: '/doctor-dashboard/patients' },
    { icon: Calendar, label: t('doctorDashboard.sidebar.appointments'), path: '/doctor-dashboard/appointments' },
    { icon: FileText, label: t('doctorDashboard.sidebar.reports'), path: '/doctor-dashboard/reports' },
    { icon: MessageSquare, label: t('doctorDashboard.sidebar.messages.title'), path: '/doctor-dashboard/messages', badge: 3 },
    { icon: Settings, label: t('doctorDashboard.sidebar.settings'), path: '/doctor-dashboard/settings' },
    { icon: HelpCircle, label: t('doctorDashboard.sidebar.help'), path: '/doctor-dashboard/help' },
  ];

  return (
    <div
      className={cn(
        "flex flex-col bg-card border-x transition-all duration-300 z-10 sticky top-[73px]",
        collapsed ? "w-20" : "w-64",
        "h-[calc(100vh-73px)]",
        className
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <h2 className="font-semibold text-lg truncate">
            {t('doctorDashboard.sidebar.title')}
          </h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapse}
          className={cn(collapsed && "mx-auto")}
          aria-label="Toggle Sidebar"
        >
          {collapsed ? (
            <Menu className="h-5 w-5" />
          ) : isRTL ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group relative",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  collapsed && "justify-center px-0"
                )
              }
              // Add title for tooltip when collapsed
              title={collapsed ? item.label : undefined}
              end={item.path === '/doctor-dashboard'}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", collapsed && "mx-auto")} />

              {!collapsed && (
                <span className="flex-1 truncate">{item.label}</span>
              )}

              {/* Badge for notifications */}
              {item.badge && !collapsed && (
                <span className="bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}

              {/* Dot badge when collapsed */}
              {item.badge && collapsed && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-destructive" />
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Health-AI Branding at bottom */}
      <div className={cn("p-4 border-t mt-auto", collapsed && "text-center")}>
        <div className={cn("flex items-center gap-2", collapsed && "justify-center")}>
          <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-primary font-bold text-sm">AI</span>
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-medium leading-none truncate">Health-Care</p>
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {t('doctorDashboard.sidebar.doctorPortal')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
