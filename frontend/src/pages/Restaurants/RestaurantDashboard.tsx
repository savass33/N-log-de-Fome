import React from "react";
import { StatsCard } from "../../components/dashboard/StatsCard";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "../Dashboard/Dashboard.css"; // Reutilizando o CSS do dashboard

// Mock de dados
const mockPendingOrders = [
  { id: "1001", clientName: "Ana Silva", total: 55.5 },
  { id: "1002", clientName: "Bruno Costa", total: 80.0 },
];
const mockReviews = [
  { clientName: "Carla Dias", rating: 5, comment: "Melhor açaí!" },
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
        <StatsCard title="Nota Média" value="4.8 ★" />
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
              <Link to="/app/restaurant/orders" className="btn-login">
                Ver Pedido
              </Link>
            </div>
          ))}
          {mockPendingOrders.length === 0 && (
            <p>Nenhum pedido novo no momento.</p>
          )}
        </Card>

        {/* 3. Última Avaliação */}
        <Card title="Última Avaliação" className="quick-access-card">
          {mockReviews.map((review, i) => (
            <div key={i} className="review-summary">
              <strong>{review.clientName}:</strong>
              <p>
                "{review.comment}" ({review.rating} ★)
              </p>
            </div>
          ))}

          <Link to={"/app/restaurant/reviews"} className="btn-login">
            Ver todas
          </Link>
        </Card>
      </div>
    </div>
  );
};
