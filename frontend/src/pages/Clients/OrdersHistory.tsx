import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importante para navegação
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { type IOrder } from "../../interfaces/IOrder";
import { orderService } from "../../services/orderService";
import { Loader } from "../../components/common/Loader";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import "./Client.css";

export const OrdersHistory: React.FC = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await orderService.getAllOrders();
      // Ordena do mais recente para o mais antigo
      const sorted = data.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(sorted);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Configuração de cores e textos para os status (pt-BR)
  const getStatusConfig = (status: string) => {
    const s = status?.toLowerCase() || "";

    if (s.includes("pendente") || s.includes("pending"))
      return { bg: "#fc8403", color: "#664d03", label: "Pendente" };
    if (s.includes("preparando") || s.includes("preparing"))
      return { bg: "#ffecb5", color: "#664d03", label: "Em Preparo" };
    if (s.includes("caminho") || s.includes("on_the_way"))
      return { bg: "#cff4fc", color: "#664d03", label: "A Caminho" };
    if (s.includes("entregue") || s.includes("delivered"))
      return { bg: "#d1e7dd", color: "#664d03", label: "Entregue" };
    if (s.includes("cancelado") || s.includes("canceled"))
      return { bg: "#f8d7da", color: "#664d03", label: "Cancelado" };

    return { bg: "#e2e3e5", color: "#383d41", label: status };
  };

  if (isLoading) return <Loader />;

  return (
    <div className="client-page-container">
      <h1>Meus Pedidos</h1>

      <div className="orders-history-list">
        {orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
            <p>Você ainda não realizou nenhum pedido.</p>
            <Button
              onClick={() => navigate("/client/restaurants")}
              style={{ marginTop: "10px" }}
            >
              Fazer meu primeiro pedido
            </Button>
          </div>
        ) : (
          orders.map((order) => {
            const statusConfig = getStatusConfig(order.status);

            return (
              <Card key={order.id} className="order-history-card">
                <div className="order-history-info">
                  <h3 style={{ marginBottom: "4px" }}>
                    {order.restaurantName}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "#666",
                      marginBottom: "8px",
                    }}
                  >
                    {formatDate(order.createdAt)}
                  </p>
                  <p
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      color: "#333",
                    }}
                  >
                    Total: {formatCurrency(order.totalValue)}
                  </p>
                </div>

                <div
                  className="order-history-status"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: "10px",
                  }}
                >
                  <span
                    className="status-badge"
                    style={{
                      padding: "6px 12px",
                      borderRadius: "20px",
                      backgroundColor: statusConfig.bg,
                      color: statusConfig.color,
                      fontSize: "0.85rem",
                      fontWeight: "bold",
                      border: `1px solid ${statusConfig.color}20`,
                    }}
                  >
                    {statusConfig.label}
                  </span>

                  <Button
                    onClick={() => navigate(`/client/orders/${order.id}`)}
                    style={{ fontSize: "0.8rem", padding: "8px 16px" }}
                  >
                    Ver Detalhes
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
