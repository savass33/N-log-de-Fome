import { Routes, Route, Navigate } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";
import { useAuth } from "../hooks/useAuth";

// --- Dashboards ---
import { AdminDashboard } from "../pages/Admin/AdminDashboard";
import { RestaurantDashboard } from "../pages/Restaurants/RestaurantDashboard";
import { ClientDashboard } from "../pages/Clients/ClientDashboard";

// --- Páginas de Admin ---
import { RestaurantsList as AdminRestaurantsList } from "../pages/Admin/RestaurantList";
import { ClientsList } from "../pages/Admin/ClientsList";
import { OrdersList as AdminOrdersList } from "../pages/Admin/OrdersList";
import { OrderDetails } from "../pages/Clients/OrdersDetails";
import { AdminSettings } from "../pages/Admin/AdminSettings";

// --- Páginas de Restaurante ---
import { MyRestaurant } from "../pages/Restaurants/MyRestaurant";
import { MenuManagement } from "../pages/Restaurants/MenuManagement";
import { OrdersManagement } from "../pages/Restaurants/OrdersManagement";
import { RestaurantSettings } from "../pages/Restaurants/RestaurantSettings";

// --- Páginas de Cliente ---
import { RestaurantsList as ClientRestaurantsList } from "../pages/Clients/RestaurantList";
import { RestaurantMenu } from "../pages/Clients/RestaurantMenu";
import { Checkout } from "../pages/Clients/Checkout";
import { OrdersHistory } from "../pages/Clients/OrdersHistory";
import { ClientProfile } from "../pages/Clients/ClientProfile";

// --- Páginas Compartilhadas (Settings) ---
import { AccountSettings } from "../pages/shared/Settings/AccountSettings";
import { Preferences } from "../pages/shared/Settings/Preferences";

// --- Páginas de Erro ---
import { NotFound } from "../pages/shared/Errors/NotFound";
import { AccessDenied } from "../pages/shared/Errors/AccessDenied";

// --- Tipos de Perfil ---
export type UserRole = "admin" | "restaurant" | "client";

export const AppRoutes = () => {
  const { user } = useAuth(); // Usando o hook de verdade

  return (
    <Routes>
      {/* --- ROTA RAIZ (Redirect) --- */}
      <Route
        path="/"
        element={
          user?.role === "admin" ? (
            <Navigate to="/admin/dashboard" />
          ) : user?.role === "restaurant" ? (
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
        <Route path="/admin/orders/:id" element={<OrderDetails />} />{" "}
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Route>

      {/* --- ROTAS DE RESTAURANTE (Protegidas) --- */}
      <Route element={<PrivateRoute allowedRoles={["restaurant"]} />}>
        <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
        <Route path="/restaurant/my-restaurant" element={<MyRestaurant />} />
        <Route path="/restaurant/orders" element={<OrdersManagement />} />
        <Route path="/restaurant/menu" element={<MenuManagement />} />
        <Route
          path="/restaurant/settings"
          element={<RestaurantSettings />}
          all-allowed
        />
      </Route>

      {/* --- ROTAS DE CLIENTE (Protegidas) --- */}
      <Route element={<PrivateRoute allowedRoles={["client"]} />}>
        <Route path="/client/dashboard" element={<ClientDashboard />} />
        <Route path="/client/restaurants" element={<ClientRestaurantsList />} />
        <Route
          path="/client/restaurants/:id/menu"
          element={<RestaurantMenu />}
        />
        <Route path="/client/checkout" element={<Checkout />} />
        <Route path="/client/orders" element={<OrdersHistory />} />
        <Route path="/client/profile" element={<ClientProfile />} />
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
