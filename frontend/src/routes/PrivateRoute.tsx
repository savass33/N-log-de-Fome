import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { type UserRole } from './AppRoutes';
import { Loader } from '../components/common/Loader';

interface PrivateRouteProps {
  allowedRoles: UserRole[];
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
  // Agora usando o hook de verdade!
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  if (!user) {
    // Usuário não logado, redireciona para o login
    // (O App.tsx já faz isso, mas é uma garantia extra)
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.role as UserRole)) {
    // Usuário logado, mas sem permissão
    return <Navigate to="/access-denied" replace />;
  }

  // Usuário logado e com permissão
  return <Outlet />; // Renderiza o componente da rota (ex: <AdminDashboard />)
};