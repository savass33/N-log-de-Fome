import { Routes, Route, Navigate } from 'react-router-dom';

// Importações das páginas (usando scaffolds por enquanto)
import { AdminDashboard } from '../pages/Dashboard/AdminDashboard';
import { RestaurantDashboard } from '../pages/Dashboard/RestaurantDashboard';
import { OrdersManagement } from '../pages/Restaurants/OrdersManagement';
/* import { MenuManagement } from '../pages/Restaurants/MenuManagement';
import { ClientsList } from '../pages/Admin/ClientsList';
import { RestaurantsList } from '../pages/Restaurants/RestaurantList';
import { NotFound } from '../pages/Errors/NotFound';
 */
export const AppRoutes = () => {
  // A lógica de qual dashboard mostrar viria do useAuth()
  type UserRole = 'admin' | 'restaurant' | 'client';
  const userRole: UserRole = 'restaurant'; // Mockado como 'restaurant' por enquanto

  return (
    <Routes>
      {/* Rota Raiz */}
      <Route 
        path="/" 
        element={
          userRole === 'admin' ? <Navigate to="/admin/dashboard" /> :
          userRole === 'restaurant' ? <Navigate to="/restaurant/dashboard" /> :
          <Navigate to="/client/restaurants" />
        } 
      />

      {/* Rotas de Admin */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      {/* <Route path="/admin/restaurants" element={<RestaurantsList />} />
      <Route path="/admin/clients" element={<ClientsList />} /> */}

      {/* Rotas de Restaurante */}
      <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
      <Route path="/restaurant/orders" element={<OrdersManagement />} />
      {/* <Route path="/restaurant/menu" element={<MenuManagement />} /> */}

      {/* Rotas de Cliente (exemplo) */}
      {/* <Route path="/client/restaurants" element={<ClientRestaurantsList />} /> */}

      {/* Rota 404 */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
};