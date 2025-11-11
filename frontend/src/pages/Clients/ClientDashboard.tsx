import React from "react";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Link } from "react-router-dom";
import "../Dashboard/Dashboard.css"; // Reutilizando o CSS do dashboard

// Mock de dados para esta página
const mockRecentOrders = [
  {
    id: "2001",
    restaurantName: "Pizza da Boa",
    status: "delivered",
    total: 35.5,
  },
  {
    id: "2002",
    restaurantName: "Sushi Express",
    status: "on_the_way",
    total: 70.0,
  },
];

// Mock de nome de usuário (viria do useAuth)
const userName = "Ana";

export const ClientDashboard: React.FC = () => {
  return (
    <div className="dashboard-container">
      <h1>Olá, {userName}!</h1>
      <p>O que você gostaria de pedir hoje?</p>

      <div className="dashboard-grid">
        <Card title="Acesso Rápido" className="quick-access-card">
          <div className="quick-links">
            <Link to="/client/restaurants">
              <Button>Ver Restaurantes</Button>
            </Link>
            <Link to="/client/orders">
              <Button>Meus Pedidos</Button>
            </Link>
            <Link to="/client/profile">
              <Button>Meu Perfil</Button>
            </Link>
          </div>
        </Card>

        <Card title="Pedidos Recentes" className="recent-orders-card">
          {mockRecentOrders.map((order) => (
            <div key={order.id} className="order-summary-item">
              <div>
                <strong>{order.restaurantName}</strong>
                <p>Status: {order.status}</p>
              </div>
              <Link to={`/client/orders/${order.id}`}>
                <Button>Ver Detalhes</Button>
              </Link>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};
