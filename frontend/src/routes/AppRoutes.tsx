import { Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import { useAuth } from '../hooks/useAuth';

// --- Dashboards ---
import { AdminDashboard } from '../pages/Dashboard/AdminDashboard';
import { RestaurantDashboard } from '../pages/Dashboard/RestaurantDashboard';
import { ClientDashboard } from '../pages/Dashboard/ClientDashboard';

// --- Páginas de Admin ---
import { RestaurantsList as AdminRestaurantsList } from '../pages/Restaurants/RestaurantList'; // Caminho corrigido
import { ClientsList } from '../pages/Admin/ClientsList';
import { OrdersList as AdminOrdersList } from '../pages/Admin/OrdersList';
import { OrderDetails } from '../pages/Orders/OrdersDetails'; // NOVO
import { Analytics } from '../pages/Admin/Analytics';
import { AdminSettings } from '../pages/Admin/AdminSettings';
import { SupportCenter } from '../pages/Admin/SupportCenter';

// --- Páginas de Restaurante ---
import { MyRestaurant } from '../pages/Restaurants/MyRestaurant'; // Caminho corrigido
import { MenuManagement } from '../pages/Restaurants/MenuManagement'; // Caminho corrigido
import { OrdersManagement } from '../pages/Restaurants/OrdersManagement'; // Caminho corrigido
import { RestaurantSettings } from '../pages/Restaurants/RestaurantSettings'; // Caminho corrigido
import { Reviews } from '../pages/Restaurants/Reviews'; // Caminho corrigido

// --- Páginas de Cliente ---
import { RestaurantsList as ClientRestaurantsList } from '../pages/Client/RestaurantsList'; // NOVO (Importação correta)
import { RestaurantMenu } from '../pages/Client/RestaurantMenu'; // NOVO
import { Checkout } from '../pages/Client/Checkout'; // NOVO
import { OrdersHistory } from '../pages/Client/OrdersHistory'; // NOVO
import { ClientProfile } from '../pages/Client/ClientProfile'; // NOVO

// --- Páginas Compartilhadas (Settings) ---
import { AccountSettings } from '../pages/Settings/AccountSettings';
import { Preferences } from '../pages/Settings/Preferences';

// --- Páginas de Erro ---
import { NotFound } from '../pages/Errors/NotFound';
import { AccessDenied } from '../pages/Errors/AccessDenied';

// --- Tipos de Perfil ---
export type UserRole = 'admin' | 'restaurant' | 'client';

export const AppRoutes = () => {
  const { user } = useAuth(); // Usando o hook de verdade

  return (
    <Routes>
      {/* --- ROTA RAIZ (Redirect) --- */}
      <Route
        path="/"
        element={
          user?.role === 'admin' ? (
            <Navigate to="/admin/dashboard" />
          ) : user?.role === 'restaurant' ? (
            <Navigate to="/restaurant/dashboard" />
          ) : (
            <Navigate to="/client/dashboard" />
          )
        }
      />

      {/* --- ROTAS DE ADMIN (Protegidas) --- */}
      <Route element={<PrivateRoute allowedRoles={['admin']} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/restaurants" element={<AdminRestaurantsList />} />
        <Route path="/admin/clients" element={<ClientsList />} />
        <Route path="/admin/orders" element={<AdminOrdersList />} />
        <Route path="/admin/orders/:id" element={<OrderDetails />} /> {/* ROTA DE DETALHE */}
        <Route path="/admin/analytics" element={<Analytics />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/support" element={<SupportCenter />} />
      </Route>

      {/* --- ROTAS DE RESTAURANTE (Protegidas) --- */}
      <Route element={<PrivateRoute allowedRoles={['restaurant']} />}>
        <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
        <Route path="/restaurant/my-restaurant" element={<MyRestaurant />} />
        <Route path="/restaurant/orders" element={<OrdersManagement />} />
        <Route path="/restaurant/menu" element={<MenuManagement />} />
        <Route path="/restaurant/reviews" element={<Reviews />} />
        <Route path="/restaurant/settings" element={<RestaurantSettings />} />
      </Route>

      {/* --- ROTAS DE CLIENTE (Protegidas) --- */}
      <Route element={<PrivateRoute allowedRoles={['client']} />}>
        <Route path="/client/dashboard" element={<ClientDashboard />} />
        <Route path="/client/restaurants" element={<ClientRestaurantsList />} /> {/* CORRIGIDO */}
        <Route path="/client/restaurants/:id/menu" element={<RestaurantMenu />} /> {/* CORRIGIDO */}
        <Route path="/client/checkout" element={<Checkout />} /> {/* NOVO */}
        <Route path="/client/orders" element={<OrdersHistory />} /> {/* CORRIGIDO */}
        <Route path="/client/profile" element={<ClientProfile />} /> {/* NOVO */}
      </Route>

      {/* --- ROTAS COMPARTILHADAS (Todos os perfis logados) --- */}
      <Route
        element={
          <PrivateRoute allowedRoles={['admin', 'restaurant', 'client']} />
        }
      >
        <Route path="/settings/account" element={<AccountSettings />} />
        <Route path="/settings/preferences" element={<Preferences />} />
      </Route>

      {/* --- ROTAS DE ERRO --- */}
      <Route path="/access-denied" element={<AccessDenied />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};