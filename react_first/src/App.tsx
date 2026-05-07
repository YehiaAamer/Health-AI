import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthContext";
import { GlobalLoaderProvider } from "./contexts/GlobalLoaderContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import ChatBot from "./components/ChatBot";
import LandingPage from "./pages/public/LandingPage";
import Auth from "./pages/auth/Auth.tsx";
import Dashboard from "./pages/patient/Dashboard";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorLayout from "./components/layout/DoctorLayout";
import PatientsPage from "./pages/doctor/PatientsPage";
import AppointmentsPage from "./pages/doctor/AppointmentsPage";
import ReportsPage from "./pages/doctor/ReportsPage";
import MessagesPage from "./pages/doctor/MessagesPage";
import SettingsPage from "./pages/doctor/SettingsPage";
import HelpPage from "./pages/doctor/HelpPage";
import DiagnosisWizard from "./pages/patient/DiagnosisWizard";
import Report from "./pages/patient/Report";
import PastReports from "./pages/patient/PastReports";
import History from "./pages/patient/History";
import EditProfile from "./pages/patient/EditProfile";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPasswordConfirm from "./pages/auth/ResetPasswordConfirm";
import Consultations from "./pages/patient/Consultations";
import Help from "./pages/public/Help";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import TermsOfService from "./pages/legal/TermsOfService";
import ContactUs from "./pages/public/ContactUs";
import NotFound from "./pages/public/NotFound";
import { useAuth } from "@/hooks/useAuth";

function AuthenticatedChatBot() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return <ChatBot />;
}

/**
 * Redirects the user to their appropriate dashboard based on their role.
 */
function DashboardRedirect() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/auth?tab=login" replace />;

  if (user?.role === "doctor") {
    return <Navigate to="/doctor-dashboard" replace />;
  }

  return <Dashboard />;
}

export default function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const isArabic = i18n.language === "ar";
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
    document.documentElement.lang = isArabic ? "ar" : "en";
  }, [i18n.language]);

  return (
    <AuthProvider>
      <GlobalLoaderProvider>
        <Toaster />

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<LandingPage />} />
          <Route path="/auth" element={<Auth />} />

          <Route
            path="/login"
            element={<Navigate to="/auth?tab=login" replace />}
          />
          <Route
            path="/signup"
            element={<Navigate to="/auth?tab=signup" replace />}
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardRedirect />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor-dashboard"
            element={
              <ProtectedRoute requiredRole="doctor">
                <DoctorLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DoctorDashboard />} />
            <Route path="patients" element={<PatientsPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="help" element={<HelpPage />} />
          </Route>
          <Route
            path="/diagnosis"
            element={
              <ProtectedRoute>
                <DiagnosisWizard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report"
            element={
              <ProtectedRoute>
                <Report />
              </ProtectedRoute>
            }
          />
          <Route
            path="/consultations"
            element={
              <ProtectedRoute>
                <Consultations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/past-reports"
            element={
              <ProtectedRoute>
                <PastReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/reset-password/:uid/:token"
            element={<ResetPasswordConfirm />}
          />

          <Route path="/help" element={<Help />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/contact" element={<ContactUs />} />

          <Route path="*" element={<NotFound />} />
        </Routes>

        <AuthenticatedChatBot />
      </GlobalLoaderProvider>
    </AuthProvider>
  );
}
