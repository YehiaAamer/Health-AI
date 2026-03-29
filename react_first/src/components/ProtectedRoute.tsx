// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import LoadingDots from '@/components/Shared/LoadingDots';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

/**
 * Component يحمي الـ routes من الوصول بدون تسجيل دخول
 * 
 * الاستخدام:
 * ```tsx
 * <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
 * ```
 */
export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  // أثناء التحميل
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="mx-auto mb-4">
              <LoadingDots size={12} colorClass="bg-primary" />
            </div>
            <p className="text-muted-foreground">جاري التحقق من تسجيل الدخول...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // لم يسجل دخول - إعادة توجيه للـ login
  if (!isAuthenticated) {
    return <Navigate to="/auth?tab=login" replace />;
  }

  // التحقق من الـ role (اختياري)
  if (requiredRole && user) {
    // يمكنك إضافة logic هنا للتحقق من الـ role
    // if (user.role !== requiredRole) {
    //   return <Navigate to="/" replace />;
    // }
  }

  return <>{children}</>;
}
