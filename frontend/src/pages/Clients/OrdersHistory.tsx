import React, { useState } from "react";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { type IOrder } from "../../interfaces/IOrder";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import "./Client.css";

// Mock de dados
const mockOrders: Partial<IOrder>[] = [
  {
    id: "o1",
    restaurantName: "Pizza da Boa",
    status: "delivered",
    createdAt: new Date(Date.now() - 10000000).toISOString(),
    totalValue: 45.0,
  },
  {
    id: "o2",
    restaurantName: "Sushi Express",
    status: "on_the_way",
    createdAt: new Date(Date.now() - 100000).toISOString(),
    totalValue: 80.5,
  },
  {
    id: "o3",
    restaurantName: "Burger do Zé",
    status: "cancelled",
    createdAt: new Date(Date.now() - 20000000).toISOString(),
    totalValue: 30.0,
  },
];

export const OrdersHistory: React.FC = () => {
  const [orders] = useState(mockOrders);

  return (
    <div className="client-page-container">
      <h1>Meus Pedidos</h1>

      <div className="orders-history-list">
        {orders.map((order) => (
          <Card key={order.id} className="order-history-card">
            <div className="order-history-info">
              <h3>{order.restaurantName}</h3>
              <p>Data: {formatDate(order.createdAt!)}</p>
              <p>Total: {formatCurrency(order.totalValue!)}</p>
            </div>
            <div className="order-history-status">
              <span className={`status-badge status-${order.status}`}>
                {order.status}
              </span>
              <Button onClick={() => console.log("Clicou")} style={{ marginTop: "8px" }}>Ver Detalhes</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
