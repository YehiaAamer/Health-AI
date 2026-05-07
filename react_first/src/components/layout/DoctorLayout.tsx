import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from '@/hooks/useAuth';
import { useApiCall } from '@/hooks/useApiCall';
import { API_ENDPOINTS } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Search, LogOut } from 'lucide-react';
import DoctorSidebar from "../doctor/DoctorSidebar";
import Footer from "../shared/Footer";

export default function DoctorLayout() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const apiCall = useApiCall();
  const isRTL = i18n.language === "ar";

  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiCall(API_ENDPOINTS.DOCTOR_DASHBOARD);
        setStats(data);
      } catch (error) {
        console.error("Failed to load header stats", error);
      }
    };
    fetchStats();
  }, [apiCall]);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex flex-1 overflow-hidden">
        <DoctorSidebar className="shrink-0" />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Header */}
          <header className="bg-card border-b px-6 py-4 flex items-center justify-between sticky top-0 z-20">
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                HealthCare AI <span className="text-muted-foreground font-normal text-sm ml-2">| {t('doctorDashboard.sidebar.doctorPortal')}</span>
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative hidden md:block w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t('doctorDashboard.searchPlaceholder')}
                  className="pl-9 bg-muted/50 focus-visible:bg-background border-none rounded-full h-9"
                />
              </div>

              <Button variant="outline" size="icon" className="relative rounded-full h-9 w-9">
                <Bell className="h-4 w-4" />
                {stats?.unread_notifications > 0 && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-background" />
                )}
              </Button>

              <div className="flex items-center gap-3 pl-4 border-l">
                <Avatar className="h-9 w-9 border border-primary/20">
                  <AvatarImage src={user?.profile_picture || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {user?.first_name?.charAt(0) || 'D'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium leading-none">{user?.first_name} {user?.last_name}</p>
                  <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">{user?.role}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-destructive h-9 w-9">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
