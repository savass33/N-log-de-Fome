import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; // 1. Importar o hook
import "./Layout.css";

// Definição das rotas para cada perfil
const adminNav = [
  { path: "/admin/dashboard", label: "Dashboard" },
  { path: "/admin/restaurants", label: "Restaurantes" },
  { path: "/admin/clients", label: "Clientes" },
  { path: "/admin/orders", label: "Pedidos" },
  { path: "/admin/analytics", label: "Analytics" },
  { path: "/admin/support", label: "Suporte" },
];

const restaurantNav = [
  { path: "/restaurant/dashboard", label: "Dashboard" },
  { path: "/restaurant/orders", label: "Pedidos" },
  { path: "/restaurant/menu", label: "Cardápio" },
  { path: "/restaurant/my-restaurant", label: "Meu Restaurante" },
  { path: "/restaurant/reviews", label: "Avaliações" },
  { path: "/settings/account", label: "Configurações" },
];

const clientNav = [
  { path: "/client/dashboard", label: "Início" },
  { path: "/client/restaurants", label: "Restaurantes" },
  { path: "/client/orders", label: "Meus Pedidos" },
  { path: "/client/profile", label: "Meu Perfil" },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth(); // 2. Usar o hook para saber o perfil

  // 3. Escolher os links de navegação corretos
  const getNavItems = () => {
    switch (user?.role) {
      case "admin":
        return adminNav;
      case "restaurant":
        return restaurantNav;
      case "client":
        return clientNav;
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Link to="/">NLogDeFome</Link>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item) => (
            // Compara o início do path para manter o item ativo
            <li
              key={item.path}
              className={
                location.pathname.startsWith(item.path) ? "active" : ""
              }
            >
              <Link to={item.path}>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
