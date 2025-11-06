import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

// SVGs como React Components (exemplo)
// Você pode usar 'svgr' ou colar o SVG aqui
const DashboardIcon = () => <svg>...</svg>;
const OrderIcon = () => <svg>...</svg>; // Veja o exemplo de ícone no final
const MenuIcon = () => <svg>...</svg>;

// Mock de usuário. Isso viria do AuthContext
const userRole = 'restaurant'; 

const adminNav = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { path: '/admin/restaurants', label: 'Restaurantes', icon: <MenuIcon /> },
  { path: '/admin/clients', label: 'Clientes', icon: <MenuIcon /> },
  { path: '/admin/orders', label: 'Pedidos', icon: <OrderIcon /> },
];

const restaurantNav = [
  { path: '/restaurant/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { path: '/restaurant/orders', label: 'Pedidos', icon: <OrderIcon /> },
  { path: '/restaurant/menu', label: 'Cardápio', icon: <MenuIcon /> },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navItems = userRole === 'admin' ? adminNav : restaurantNav;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        NLogDeFome
      </div>
      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item) => (
            <li key={item.path} className={location.pathname === item.path ? 'active' : ''}>
              <Link to={item.path}>
                {/* {item.icon} */}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};