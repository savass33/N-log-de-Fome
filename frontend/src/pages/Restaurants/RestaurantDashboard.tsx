import React, { useEffect, useState } from "react";
import { StatsCard } from "../../components/dashboard/StatsCard";
import { Card } from "../../components/common/Card";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { orderService } from "../../services/orderService";
import { type IOrder } from "../../interfaces/IOrder";
import { Loader } from "../../components/common/Loader";
import { formatCurrency } from "../../utils/formatCurrency";
import "../Admin/Dashboard.css";
import { Button } from "../../components/common/Button";

export const RestaurantDashboard: React.FC = () => {
  const { user } = useAuth();
  const [recentOrders, setRecentOrders] = useState<IOrder[]>([]);
  const [totalSales, setTotalSales] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.restaurantId) {
      loadDashboardData(user.restaurantId);
    }
  }, [user]);

  const loadDashboardData = async (restId: string) => {
    try {
      const orders = await orderService.getOrdersByRestaurant(restId);

      // Filtra pendentes para mostrar na lista
      const pending = orders.filter(
        (o) => o.status === "pending" || o.status === "preparing"
      );
      setRecentOrders(pending.slice(0, 3)); // Top 3

      // Calcula vendas totais (simples)
      const total = orders.reduce((acc, curr) => acc + curr.totalValue, 0);
      setTotalSales(total);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="dashboard-container">
      <h1>Dashboard do {user?.name}</h1>
      <p>Gerencie seus pedidos, cardápio e veja seu desempenho.</p>

      <div className="dashboard-grid stats-grid">
        <StatsCard
          title="Pedidos Ativos"
          value={recentOrders.length.toString()}
        />
        <StatsCard title="Vendas Totais" value={formatCurrency(totalSales)} />
      </div>

      <div className="dashboard-grid main-grid">
        <Card title="Novos Pedidos (Aguardando)" className="recent-orders-card">
          {recentOrders.length === 0 ? (
            <p>Nenhum pedido pendente no momento. Bom trabalho!</p>
          ) : (
            recentOrders.map((order) => (
              <div key={order.id} className="order-summary-item">
                <div>
                  <strong>Pedido #{order.id}</strong>
                  <p>Cliente: {order.clientName}</p>
                  <small>{formatCurrency(order.totalValue)}</small>
                </div>
                <Link to="/restaurant/orders">
                  <Button>Gerenciar</Button>
                </Link>
              </div>
            ))
          )}
        </Card>
      </div>
    </div>
  );
};
