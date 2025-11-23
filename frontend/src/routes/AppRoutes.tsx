import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";
import { useAuth } from "../hooks/useAuth";

// --- Layout ---
import { Layout } from "../components/layout/Layout";

// --- Autenticação ---
import { Login } from "../pages/Auth/Login";
import { Register } from "../pages/Auth/Register";

// --- Dashboards e Páginas ---
import { RestaurantsList as AdminRestaurantsList } from "../pages/Admin/RestaurantList";
import { ClientsList } from "../pages/Admin/ClientsList";
import { OrdersList as AdminOrdersList } from "../pages/Admin/OrdersList";
import { OrderDetails } from "../pages/Clients/OrdersDetails";

import { MyRestaurant } from "../pages/Restaurants/MyRestaurant";
import { MenuManagement } from "../pages/Restaurants/MenuManagement";
import { OrdersManagement } from "../pages/Restaurants/OrdersManagement";
import { RestaurantSettings } from "../pages/Restaurants/RestaurantSettings";

import { ClientDashboard } from "../pages/Clients/ClientDashboard";
import { RestaurantsList as ClientRestaurantsList } from "../pages/Clients/RestaurantList";
import { RestaurantMenu } from "../pages/Clients/RestaurantMenu";
import { Checkout } from "../pages/Clients/Checkout";
import { OrdersHistory } from "../pages/Clients/OrdersHistory";
import { ClientProfile } from "../pages/Clients/ClientProfile";

import { AccountSettings } from "../pages/shared/Settings/AccountSettings";
import { Preferences } from "../pages/shared/Settings/Preferences";
import { NotFound } from "../pages/shared/Errors/NotFound";
import { AccessDenied } from "../pages/shared/Errors/AccessDenied";

export type UserRole = "admin" | "restaurant" | "client";

export const AppRoutes = () => {
  const { user } = useAuth();

  // Função auxiliar para decidir para onde mandar o usuário quando ele acessa "/"
  const getHomeRoute = () => {
    if (!user) return "/login"; // <--- AQUI ESTÁ A MÁGICA

    // Se já estiver logado, manda para a home correta de cada perfil
    switch (user.role) {
      case "admin":
        return "/admin/restaurants";
      case "restaurant":
        return "/restaurant/orders";
      case "client":
        return "/client/restaurants";
      default:
        return "/login";
    }
  };

  return (
    <Routes>
      {/* ========================================================= */}
      {/* 🧭 ROTA RAIZ (Redirecionamento Automático)               */}
      {/* ========================================================= */}
      <Route path="/" element={<Navigate to={getHomeRoute()} replace />} />
      {/* ========================================================= */}
      {/* 🔓 ROTAS PÚBLICAS (Sem Layout, Sem Sidebar)              */}
      {/* ========================================================= */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* ========================================================= */}
      {/* 🔒 ROTAS PRIVADAS (Com Layout + Sidebar)                 */}
      {/* ========================================================= */}
      <Route
        element={
          <Layout>
            <Outlet />
          </Layout>
        }
      >
        {/* --- ADMIN --- */}
        <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/restaurants" element={<AdminRestaurantsList />} />
          <Route path="/admin/clients" element={<ClientsList />} />
          <Route path="/admin/orders" element={<AdminOrdersList />} />
          <Route path="/admin/orders/:id" element={<OrderDetails />} />
        </Route>

        {/* --- RESTAURANTE --- */}
        <Route element={<PrivateRoute allowedRoles={["restaurant"]} />}>
          <Route path="/restaurant/my-restaurant" element={<MyRestaurant />} />
          <Route path="/restaurant/orders" element={<OrdersManagement />} />
          <Route path="/restaurant/menu" element={<MenuManagement />} />
          <Route path="/restaurant/settings" element={<RestaurantSettings />} />
        </Route>

        {/* --- CLIENTE --- */}
        <Route element={<PrivateRoute allowedRoles={["client"]} />}>
          <Route path="/client/dashboard" element={<ClientDashboard />} />
          <Route
            path="/client/restaurants"
            element={<ClientRestaurantsList />}
          />
          <Route
            path="/client/restaurants/:id/menu"
            element={<RestaurantMenu />}
          />
          <Route path="/client/checkout" element={<Checkout />} />
          <Route path="/client/orders" element={<OrdersHistory />} />
          <Route path="/client/profile" element={<ClientProfile />} />
        </Route>

        {/* --- COMPARTILHADAS --- */}
        <Route
          element={
            <PrivateRoute allowedRoles={["admin", "restaurant", "client"]} />
          }
        >
          <Route path="/settings/account" element={<AccountSettings />} />
          <Route path="/settings/preferences" element={<Preferences />} />
        </Route>
      </Route>{" "}
      {/* Fim do Layout Wrapper */}
      {/* --- ERROS --- */}
      <Route path="/access-denied" element={<AccessDenied />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
