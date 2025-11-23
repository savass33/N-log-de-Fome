import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      // Idealmente usaríamos getOrdersByClient, mas getAllOrders + filter funciona
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

  if (isLoading) return <Loader />;

  return (
    <div className="client-page-container">
      <h1>Meus Pedidos</h1>

      <div className="orders-history-list">
        {orders.length === 0 ? (
          <p>Nenhum pedido encontrado.</p>
        ) : (
          orders.map((order) => (
            <Card key={order.id} className="order-history-card">
              <div className="order-history-info">
                <h3>{order.restaurantName}</h3>
                <p>Data: {formatDate(order.createdAt)}</p>
                <p>Total: {formatCurrency(order.totalValue)}</p>
              </div>
              <div className="order-history-status">
                <span
                  className="status-badge"
                  style={{
                    padding: "6px 10px",
                    borderRadius: "4px",
                    backgroundColor: "#eee",
                    fontSize: "0.9rem",
                  }}
                >
                  {order.status}
                </span>
                {/* Se tiver tela de detalhes específica, use Link to={`/client/orders/${order.id}`} */}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
