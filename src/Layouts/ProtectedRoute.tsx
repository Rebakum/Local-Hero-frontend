import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { Loader2 } from 'lucide-react';
import type { UserRole } from '../types/auth';
import { LoadingSplash } from '../Components/ui';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ROLE_DASHBOARD_MAP: Record<UserRole, string> = {
  user: '/dashboard/user',
  serviceProvider: '/dashboard/provider',
  ADMIN: '/dashboard/admin',
  SUPER_ADMIN: '/dashboard/super-admin',
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream-50 dark:bg-n
      avy-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <LoadingSplash
          />
          {/* <Loader2 className="w-8 h-8 text-primary animate-spin" /> */}
          <p className="text-sm text-navy-800 dark:text-navy-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    const redirectPath = ROLE_DASHBOARD_MAP[user.role] || '/dashboard/user';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
