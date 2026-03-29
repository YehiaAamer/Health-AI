import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthContext";
import { GlobalLoaderProvider } from "./contexts/GlobalLoaderContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import ChatBot from "./components/ChatBot";
import LandingPage from "./pages/LandingPage";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import DiagnosisWizard from "./pages/DiagnosisWizard";
import Report from "./pages/Report";
import PastReports from "./pages/PastReports";
import History from "./pages/History";
import EditProfile from "./pages/EditProfile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPasswordConfirm from "./pages/ResetPasswordConfirm";
import Consultations from "./pages/Consultations";
import Help from "./pages/Help";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import ContactUs from "./pages/ContactUs";
import NotFound from "./pages/NotFound";

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
                <Dashboard />
              </ProtectedRoute>
            }
          />
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

        <ChatBot />
      </GlobalLoaderProvider>
    </AuthProvider>
  );
}