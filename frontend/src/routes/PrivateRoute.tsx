import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { type UserRole } from './AppRoutes';
import { Loader } from '../components/common/Loader';

interface PrivateRouteProps {
  allowedRoles: UserRole[];
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.role as UserRole)) {
    return <Navigate to="/access-denied" replace />;
  }

  return <Outlet />;
};