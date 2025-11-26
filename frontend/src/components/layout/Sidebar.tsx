import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./Layout.css";

const adminNav = [
  { path: "/admin/restaurants", label: "Restaurantes" },
  { path: "/admin/clients", label: "Clientes" },
  { path: "/admin/orders", label: "Pedidos" },
];

const restaurantNav = [
  { path: "/restaurant/orders", label: "Pedidos" },
  { path: "/restaurant/menu", label: "Cardápio" },
  { path: "/restaurant/my-restaurant", label: "Meu Restaurante" },
];

const clientNav = [
  { path: "/client/dashboard", label: "Início" },
  { path: "/client/restaurants", label: "Restaurantes" },
  { path: "/client/orders", label: "Meus Pedidos" },
  { path: "/client/profile", label: "Meu Perfil" },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

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
