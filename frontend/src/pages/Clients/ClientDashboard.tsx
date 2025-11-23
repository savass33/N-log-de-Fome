import React, { useEffect, useState } from "react";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { orderService } from "../../services/orderService";
import { type IOrder } from "../../interfaces/IOrder";
import { Loader } from "../../components/common/Loader";
import { formatCurrency } from "../../utils/formatCurrency";
import "../Admin/Dashboard.css";

export const ClientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [recentOrders, setRecentOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.clientId) {
      loadRecentOrders(user.clientId);
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const loadRecentOrders = async (clientId: string) => {
    try {
      // Se o backend tiver a rota dedicada, usamos getOrdersByClient
      // Se não, usamos a lógica de filtro no front (getAllOrders)
      const allOrders = await orderService.getAllOrders(); // Fallback seguro

      const myOrders = allOrders
        .filter((o) => o.clientName === user?.name) // Ou filtro por ID se disponível
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 3);

      setRecentOrders(myOrders);
    } catch (error) {
      console.error("Erro dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="dashboard-container">
      <h1>Olá, {user?.name || "Cliente"}!</h1>
      <p>O que você gostaria de pedir hoje?</p>

      <div className="dashboard-grid">
        <Card title="Acesso Rápido" className="quick-access-card">
          <div className="quick-links">
            <Link to="/client/restaurants">
              <Button style={{ color: "white" }}>Ver Restaurantes</Button>
            </Link>
            <Link to="/client/orders">
              <Button style={{ color: "white" }}>Meus Pedidos</Button>
            </Link>
            <Link to="/client/profile">
              <Button style={{ color: "white" }}>Meu Perfil</Button>
            </Link>
          </div>
        </Card>

        <Card title="Últimos Pedidos" className="recent-orders-card">
          {recentOrders.length === 0 ? (
            <div
              style={{ textAlign: "center", padding: "20px", color: "#666" }}
            >
              <p style={{ fontStyle: "italic", marginBottom: "10px" }}>
                Você ainda não fez nenhum pedido.
              </p>
              <Link to="/client/restaurants">
                <Button>Fazer Pedido</Button>
              </Link>
            </div>
          ) : (
            recentOrders.map((order) => (
              <div key={order.id} className="order-summary-item">
                <div>
                  <strong>{order.restaurantName}</strong>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "#555",
                      margin: "2px 0",
                    }}
                  >
                    {order.status}
                  </p>
                  <strong style={{ color: "#28a745" }}>
                    {formatCurrency(order.totalValue)}
                  </strong>
                </div>
                <Link to={`/client/orders/${order.id}`}>
                  <Button style={{ fontSize: "0.8rem" }}>Detalhes</Button>
                </Link>
              </div>
            ))
          )}
        </Card>
      </div>
    </div>
  );
};
