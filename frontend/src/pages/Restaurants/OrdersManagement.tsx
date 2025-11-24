import React, { useEffect, useState } from "react";
import { type IOrder, type OrderStatus } from "../../interfaces/IOrder";
import { orderService } from "../../services/orderService";
import { Card } from "../../components/common/Card";
import { Loader } from "../../components/common/Loader";
import { Button } from "../../components/common/Button";
import { useAuth } from "../../hooks/useAuth";
import { formatCurrency } from "../../utils/formatCurrency";
import "./OrdersManagement.css";

const statusMapToDb: Record<OrderStatus, string> = {
  pending: "Pendente",
  preparing: "Preparando",
  on_the_way: "Caminho",
  delivered: "Entregue",
  canceled: "Cancelado",
};

const getStatusLabel = (status: string) => {
  switch (status?.toLowerCase()) {
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

  const handleUpdateStatus = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    if (newStatus === "canceled") {
      if (!window.confirm("Tem certeza que deseja cancelar este pedido?"))
        return;
    }

    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );

    try {
      await orderService.updateOrderStatus(orderId, newStatus);

      if (user?.restaurantId) {
        setTimeout(() => {}, 300);
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar status. O pedido voltará ao estado anterior.");
      if (user?.restaurantId) loadOrders(user.restaurantId);
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;

  const columns = ["pending", "preparing", "on_the_way"] as const;

  return (
    <div className="orders-management-page">
      <h1>Gerenciamento de Pedidos</h1>

      <div className="orders-kanban-board">
        {columns.map((status) => {
          const columnOrders = orders.filter(
            (order) => order.status === status
          );

          return (
            <div key={status} className="kanban-column">
              <h2>
                {getStatusLabel(status)}
                <span className="column-count"> ({columnOrders.length})</span>
              </h2>

              <div className="kanban-column-content">
                {columnOrders.length === 0 ? (
                  <div className="empty-column-state">
                    <p>Vazio</p>
                  </div>
                ) : (
                  columnOrders.map((order) => (
                    <Card key={order.id} className="order-card">
                      <div className="order-card-header">
                        <strong>#{order.id}</strong>
                        <span className="order-total">
                          {formatCurrency(order.totalValue)}
                        </span>
                      </div>

                      <div className="order-client-name">
                        {order.clientName}
                      </div>

                      <div className="order-items-list">
                        {order.items.map((item) => (
                          <div key={item.id_item} className="order-item-row">
                            <span className="item-qty">{item.quantidade}x</span>
                            <span className="item-desc">{item.descricao}</span>
                          </div>
                        ))}
                      </div>

                      <div className="order-card-actions">
                        {status === "pending" && (
                          <>
                            <Button
                              onClick={() =>
                                handleUpdateStatus(order.id, "preparing")
                              }
                              style={{ marginBottom: "8px" }}
                            >
                              Aceitar Pedido
                            </Button>
                            <Button
                              onClick={() =>
                                handleUpdateStatus(order.id, "canceled")
                              }
                              style={{ backgroundColor: "#dc3545" }}
                            >
                              Cancelar Pedido
                            </Button>
                          </>
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
                            style={{ backgroundColor: "#28a745" }}
                          >
                            Concluir Entrega
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
