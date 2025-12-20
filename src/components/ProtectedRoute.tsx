import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ReactNode, useEffect } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Detectează dacă sesiunea este de resetare parolă (access_token în hash sau query)
  const isResetPasswordSession = () => {
    if (typeof window !== 'undefined') {
      // Caută access_token în hash sau query
      const hash = window.location.hash;
      const search = window.location.search;
      return hash.includes('access_token') || search.includes('access_token');
    }
    return false;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (isResetPasswordSession() && location.pathname !== '/resetare-parola-noua') {
    return <Navigate to="/resetare-parola-noua" replace />;
  }

  return <>{children}</>;
};

interface RoleRouteProps {
  children: ReactNode;
  allowedRole: 'candidate' | 'employer';
}

export const RoleRoute = ({ children, allowedRole }: RoleRouteProps) => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile || profile.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
