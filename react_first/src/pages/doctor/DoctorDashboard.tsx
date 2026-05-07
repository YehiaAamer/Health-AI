import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useApiCall } from '@/hooks/useApiCall';
import { API_ENDPOINTS } from '@/lib/api';
import { toast } from 'sonner';

// Components
import StatsCards from '@/components/doctor/StatsCards';
import PendingPredictions from '@/components/doctor/PendingPredictions';
import RiskDistributionChart from '@/components/doctor/RiskDistributionChart';
import AppointmentsToday from '@/components/doctor/AppointmentsToday';
import ReportsSection from '@/components/doctor/ReportsSection';
import RecentActivity from '@/components/doctor/RecentActivity';

export default function DoctorDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const apiCall = useApiCall();

  const [stats, setStats] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [riskData, setRiskData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [activities, setActivities] = useState([]);
  
  const [loading, setLoading] = useState({
    stats: true,
    predictions: true,
    riskData: true,
    appointments: true,
    activities: true,
  });

  // Fetch all dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      // 1. Stats
      try {
        const statsRes = await apiCall(API_ENDPOINTS.DOCTOR_DASHBOARD);
        setStats(statsRes);
      } catch (error) {
        console.error("Failed to load stats", error);
      } finally {
        setLoading(prev => ({ ...prev, stats: false }));
      }

      // 2. Pending Predictions
      try {
        const predsRes = await apiCall(API_ENDPOINTS.DOCTOR_PENDING_PREDICTIONS);
        setPredictions(predsRes.predictions || []);
      } catch (error) {
        console.error("Failed to load predictions", error);
      } finally {
        setLoading(prev => ({ ...prev, predictions: false }));
      }

      // 3. Risk Distribution
      try {
        const riskRes = await apiCall(API_ENDPOINTS.DOCTOR_RISK_DISTRIBUTION);
        setRiskData(riskRes);
      } catch (error) {
        console.error("Failed to load risk data", error);
      } finally {
        setLoading(prev => ({ ...prev, riskData: false }));
      }

      // 4. Appointments Today
      try {
        const apptsRes = await apiCall(API_ENDPOINTS.DOCTOR_APPOINTMENTS_TODAY);
        setAppointments(apptsRes.appointments || []);
      } catch (error) {
        console.error("Failed to load appointments", error);
      } finally {
        setLoading(prev => ({ ...prev, appointments: false }));
      }

      // 5. Recent Activity
      try {
        const actRes = await apiCall(API_ENDPOINTS.DOCTOR_ACTIVITY);
        setActivities(actRes.activities || []);
      } catch (error) {
        console.error("Failed to load activities", error);
      } finally {
        setLoading(prev => ({ ...prev, activities: false }));
      }
    };

    fetchDashboardData();
  }, [apiCall]);

  const handleReviewPrediction = (id: number) => {
    toast.info("Opening review modal for prediction #" + id);
    // TODO: Implement actual review modal/flow
  };

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div>
        <h2 className="text-2xl font-bold">
          {t('doctorDashboard.welcome')}, {user?.first_name || user?.username}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {t('doctorDashboard.subtitle')}
        </p>
      </div>
      
      {/* Stats Row */}
      <StatsCards stats={stats} isLoading={loading.stats} />

      {/* Middle Row: Predictions Table + Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PendingPredictions 
          predictions={predictions} 
          isLoading={loading.predictions} 
          onReview={handleReviewPrediction} 
        />
        <RiskDistributionChart 
          data={riskData} 
          isLoading={loading.riskData} 
        />
      </div>

      {/* Bottom Row: Appointments + Reports + Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="col-span-1 md:col-span-1 lg:col-span-2 space-y-6">
          <AppointmentsToday 
            appointments={appointments} 
            isLoading={loading.appointments} 
          />
          <ReportsSection />
        </div>
        
        <div className="col-span-1 md:col-span-1 lg:col-span-3">
          <RecentActivity 
            activities={activities} 
            isLoading={loading.activities} 
          />
        </div>
      </div>
    </div>
  );
}
