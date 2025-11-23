import React, { useEffect, useState } from "react";
import { type IOrder, type OrderStatus } from "../../interfaces/IOrder";
import { orderService } from "../../services/orderService";
import { Card } from "../../components/common/Card";
import { Loader } from "../../components/common/Loader";
import { Button } from "../../components/common/Button";
import { useAuth } from "../../hooks/useAuth";
import "./OrdersManagement.css";

const getStatusLabel = (status: string) => {
  switch (
    status?.toLowerCase() // Safe check
  ) {
    case "pending":
      return "Pendente";
    case "preparing":
      return "Em Preparo";
    case "on_the_way":
      return "A Caminho";
    case "delivered":
      return "Entregue";
    case "canceled":
      return "Cancelado";
    default:
      return status;
  }
};

export const OrdersManagement: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.restaurantId) {
      loadOrders(user.restaurantId);
    }
  }, [user]);

  const loadOrders = (restId: string) => {
    setIsLoading(true);
    orderService
      .getOrdersByRestaurant(restId)
      .then(setOrders)
      .catch((err) => {
        console.error(err);
        setError("Falha ao buscar pedidos.");
      })
      .finally(() => setIsLoading(false));
  };

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    // UI Otimista
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    orderService.updateOrderStatus(orderId, newStatus).catch((err) => {
      console.error(err);
      alert("Erro ao atualizar status. Recarregando...");
      if (user?.restaurantId) loadOrders(user.restaurantId);
    });
  };

  if (isLoading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;

  const columns = ["pending", "preparing", "on_the_way"] as const;

  return (
    <div className="orders-management-page">
      <h1>Gerenciamento de Pedidos</h1>

      <div className="orders-kanban-board">
        {columns.map((status) => (
          <div key={status} className="kanban-column">
            <h2>{getStatusLabel(status)}</h2>
            <div className="kanban-column-content">
              {orders
                .filter((order) => order.status === status)
                .map((order) => (
                  <Card key={order.id} className="order-card">
                    <div style={{ marginBottom: "10px" }}>
                      <strong>Pedido #{order.id}</strong>
                      <div style={{ fontSize: "0.9rem", color: "#666" }}>
                        {order.clientName}
                      </div>
                    </div>

                    <ul style={{ paddingLeft: "20px", marginBottom: "15px" }}>
                      {order.items.map((item) => (
                        <li key={item.id_item}>
                          {item.quantidade}x {item.descricao}
                        </li>
                      ))}
                    </ul>

                    <div className="order-card-actions">
                      {status === "pending" && (
                        <Button
                          onClick={() =>
                            handleUpdateStatus(order.id, "preparing")
                          }
                        >
                          Aceitar Pedido
                        </Button>
                      )}
                      {status === "preparing" && (
                        <Button
                          onClick={() =>
                            handleUpdateStatus(order.id, "on_the_way")
                          }
                        >
                          Enviar Entrega
                        </Button>
                      )}
                      {status === "on_the_way" && (
                        <Button
                          onClick={() =>
                            handleUpdateStatus(order.id, "delivered")
                          }
                        >
                          Finalizar
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}

              {orders.filter((o) => o.status === status).length === 0 && (
                <p
                  style={{
                    textAlign: "center",
                    color: "#999",
                    fontStyle: "italic",
                  }}
                >
                  Vazio
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
