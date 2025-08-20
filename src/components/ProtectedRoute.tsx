import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth-store';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'customer' | 'photographer';
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, loading } = useAuthStore();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page with return URL
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Check role-based access if required
  if (requiredRole) {
    const userRole = user.user_metadata?.user_type || 'customer';
    if (userRole !== requiredRole) {
      // Redirect to appropriate dashboard based on user role
      const redirectPath = userRole === 'photographer' ? '/photographer-dashboard' : '/user-dashboard';
      return <Navigate to={redirectPath} replace />;
    }
  }

  return <>{children}</>;
};