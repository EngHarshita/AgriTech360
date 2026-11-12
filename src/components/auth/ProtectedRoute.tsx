import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: UserRole | UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    const loginDestination = allowedRole === 'admin' ? '/admin/login' : '/login';
    return <Navigate to={loginDestination} state={{ from: location }} replace />;
  }

  if (allowedRole) {
    const allowedRoles = Array.isArray(allowedRole) ? allowedRole : [allowedRole];
    const userRole = (user.role || 'farmer') as UserRole;
    // Admin has superuser access to inspect and use the farmer panel
    const hasAccess =
      allowedRoles.includes(userRole) ||
      (userRole === 'admin' && allowedRoles.includes('farmer'));

    if (!hasAccess) {
      return (
        <Navigate
          to="/unauthorized"
          state={{
            from: location,
            requiredRole: Array.isArray(allowedRole) ? allowedRole.join('/') : allowedRole,
            currentRole: userRole,
          }}
          replace
        />
      );
    }
  }

  return <>{children}</>;
};
