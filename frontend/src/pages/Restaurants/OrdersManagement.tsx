import React, { useEffect, useState } from "react";
import { type IOrder, type OrderStatus } from "../../interfaces/IOrder";
import { orderService } from "../../services/orderService";
import { Card } from "../../components/common/Card";
import { Loader } from "../../components/common/Loader";
import { Button } from "../../components/common/Button";
import { useAuth } from "../../hooks/useAuth";
import { formatCurrency } from "../../utils/formatCurrency";
import "./OrdersManagement.css";

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

const statusMapToDb: Record<OrderStatus, string> = {
  pending: "Pendente",
  preparing: "Preparando",
  on_the_way: "Caminho",
  delivered: "Entregue",
  canceled: "Cancelado",
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

  const loadOrders = (restId?: string) => {
    if (!restId) return;
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
    // 1. UI Otimista (Visual imediato)
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );

    try {
      console.log(`Tentando atualizar pedido ${orderId} para ${newStatus}...`);

      // 2. TRADUÇÃO EXPLÍCITA: Envia o valor exato que o banco quer (Ex: 'Preparando')
      // O TypeScript pode reclamar que o OrderStatus espera as chaves em inglês,
      // então fazemos um cast 'as any' ou ajustamos a interface, mas isso resolve o erro lógico.
      const statusParaEnviar = statusMapToDb[newStatus];

      // Nota: O service espera OrderStatus (inglês), mas vamos burlar isso para testar a teoria do banco
      // Se o backend espera inglês e traduz, isso aqui vai quebrar lá.
      // Se o backend espera português direto, isso conserta.

      // MELHOR ABORDAGEM: Mantenha o envio em INGLÊS, mas force o reload com delay
      await orderService.updateOrderStatus(orderId, newStatus);

      console.log("Sucesso no backend. Recarregando dados...");

      // 3. Delay estratégico para garantir que o banco comitou a transação antes de ler
      if (user?.restaurantId) {
        setTimeout(() => {
          loadOrders(user.restaurantId);
        }, 300);
      }
    } catch (err) {
      console.error("Erro ao atualizar:", err);
      alert("Erro ao salvar status. O pedido voltará ao estado anterior.");

      // Reverte UI
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
                            <span className="item-qty">
                              {item.quantidade}x -{" "}
                            </span>
                            <span className="item-desc">{item.descricao}</span>
                          </div>
                        ))}
                      </div>

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
                            style={{ backgroundColor: "#28a745" }}
                          >
                            Concluir
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
