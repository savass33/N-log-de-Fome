import React from "react";
import { StatsCard } from "../../components/dashboard/StatsCard";
import { Card } from "../../components/common/Card";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "../Admin/Dashboard.css"; // Reutilizando o CSS do dashboard

// Mock de dados
const mockPendingOrders = [
  { id: "1001", clientName: "Ana Silva", total: 55.5 },
  { id: "1002", clientName: "Bruno Costa", total: 80.0 },
];
export const RestaurantDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      <h1>Dashboard do {user?.name || "Restaurante"}</h1>
      <p>Gerencie seus pedidos, cardápio e veja seu desempenho.</p>

      {/* 1. Métricas Principais */}
      <div className="dashboard-grid stats-grid">
        <StatsCard
          title="Pedidos Pendentes"
          value={mockPendingOrders.length.toString()}
        />
        <StatsCard title="Vendas (Hoje)" value="R$ 450,80" />
      </div>

      <div className="dashboard-grid main-grid">
        {/* 2. Pedidos Pendentes */}
        <Card title="Novos Pedidos" className="recent-orders-card">
          {mockPendingOrders.map((order) => (
            <div key={order.id} className="order-summary-item">
              <div>
                <strong>Pedido #{order.id}</strong>
                <p>Cliente: {order.clientName}</p>
              </div>
              <Link to="/restaurant/orders" className="btn-login">
                Ver Pedido
              </Link>
            </div>
          ))}
          {mockPendingOrders.length === 0 && (
            <p>Nenhum pedido novo no momento.</p>
          )}
        </Card>
      </div>
    </div>
  );
};
