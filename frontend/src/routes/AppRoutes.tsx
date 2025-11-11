import { Routes, Route, Navigate } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute"; // Precisamos disso para segurança

// --- Dashboards ---
import { AdminDashboard } from "../pages/Dashboard/AdminDashboard";
import { RestaurantDashboard } from "../pages/Dashboard/RestaurantDashboard";
import { ClientDashboard } from "../pages/Dashboard/ClientDashboard";

// --- Páginas de Admin ---
import { RestaurantsList as AdminRestaurantsList } from "../pages/Admin/RestaurantList";
import { ClientsList } from "../pages/Admin/ClientsList";
import { OrdersList as AdminOrdersList } from "../pages/Admin/OrdersList";
import { Analytics } from "../pages/Admin/Analytics";
import { AdminSettings } from "../pages/Admin/AdminSettings";
import { SupportCenter } from "../pages/Admin/SupportCenter";

// --- Páginas de Restaurante ---
import { MyRestaurant } from "../pages/Restaurants/MyRestaurant";
import { MenuManagement } from "../pages/Restaurants/MenuManagement";
import { OrdersManagement } from "../pages/Restaurants/OrdersManagement"; // Caminho corrigido
import { RestaurantSettings } from "../pages/Restaurants/RestaurantSettings";
import { Reviews } from "../pages/Restaurants/Reviews";

// --- Páginas Compartilhadas (Settings) ---
import { AccountSettings } from "../pages/Settings/AccountSettings";
import { Preferences } from "../pages/Settings/Preferences";

// --- Páginas de Erro ---
import { NotFound } from "../pages/Errors/NotFound";
import { AccessDenied } from "../pages/Errors/AccessDenied";

// --- Tipos de Perfil ---
// (Isso viria do seu AuthContext)
export type UserRole = "admin" | "restaurant" | "client";

export const AppRoutes = () => {
  // Mockado por enquanto. Isso virá do useAuth()
  const userRole: UserRole = "admin";

  return (
    <Routes>
      {/* --- ROTA RAIZ (Redirect) --- */}
      <Route
        path="/"
        element={
          userRole === "admin" ? (
            <Navigate to="/admin/dashboard" />
          ) : userRole === "restaurant" ? (
            <Navigate to="/restaurant/dashboard" />
          ) : (
            <Navigate to="/client/dashboard" />
          )
        }
      />

      {/* --- ROTAS DE ADMIN (Protegidas) --- */}
      <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/restaurants" element={<AdminRestaurantsList />} />
        <Route path="/admin/clients" element={<ClientsList />} />
        <Route path="/admin/orders" element={<AdminOrdersList />} />
        <Route path="/admin/analytics" element={<Analytics />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/support" element={<SupportCenter />} />
      </Route>

      {/* --- ROTAS DE RESTAURANTE (Protegidas) --- */}
      <Route element={<PrivateRoute allowedRoles={["restaurant"]} />}>
        <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
        <Route path="/restaurant/my-restaurant" element={<MyRestaurant />} />
        <Route path="/restaurant/orders" element={<OrdersManagement />} />
        <Route path="/restaurant/menu" element={<MenuManagement />} />
        <Route path="/restaurant/reviews" element={<Reviews />} />
        <Route path="/restaurant/settings" element={<RestaurantSettings />} />
      </Route>

      {/* --- ROTAS DE CLIENTE (Protegidas) --- */}
      <Route element={<PrivateRoute allowedRoles={["client"]} />}>
        <Route path="/client/dashboard" element={<ClientDashboard />} />
        <Route path="/client/restaurants" element={<AdminRestaurantsList />} />
        <Route
          path="/client/restaurants/:id/menu"
          element={<MenuManagement />}
        />
      </Route>

      {/* --- ROTAS COMPARTILHADAS (Todos os perfis logados) --- */}
      <Route
        element={
          <PrivateRoute allowedRoles={["admin", "restaurant", "client"]} />
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
