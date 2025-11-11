import React, { useEffect, useState } from "react";
import { type IOrder } from "../../interfaces/IOrder";
// import { orderService } from '../../services/orderService';
import { Loader } from "../../components/common/Loader";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import "./Admin.css"; // CSS comum para páginas de admin

// Mock de dados (o service faria isso)
const mockOrders: IOrder[] = [
  {
    id: "1001",
    clientId: "c1",
    clientName: "Ana Silva",
    restaurantId: "r1",
    restaurantName: "Pizza da Boa",
    status: "pending",
    createdAt: new Date(Date.now() - 100000).toISOString(),
    totalValue: 55.5,
    items: [],
  },
  {
    id: "1002",
    clientId: "c2",
    clientName: "Bruno Costa",
    restaurantId: "r2",
    restaurantName: "Sushi Express",
    status: "preparing",
    createdAt: new Date(Date.now() - 500000).toISOString(),
    totalValue: 80.0,
    items: [],
  },
  {
    id: "1003",
    clientId: "c3",
    clientName: "Carla Dias",
    restaurantId: "r1",
    restaurantName: "Pizza da Boa",
    status: "on_the_way",
    createdAt: new Date(Date.now() - 1000000).toISOString(),
    totalValue: 25.0,
    items: [],
  },
];

export const OrdersList: React.FC = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simula chamada de API
    setTimeout(() => {
      setOrders(mockOrders);
      setIsLoading(false);
    }, 500);
  }, []);

  if (isLoading) return <Loader />;

  return (
    <div className="admin-page-container">
      <h1>Histórico de Pedidos da Plataforma</h1>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID Pedido</th>
            <th>Cliente</th>
            <th>Restaurante</th>
            <th>Data</th>
            <th>Status</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>#{order.id}</td>
              <td>{order.clientName}</td>
              <td>{order.restaurantName}</td>
              <td>{formatDate(order.createdAt)}</td>
              <td>
                <span className={`status-badge status-${order.status}`}>
                  {order.status}
                </span>
              </td>
              <td>{formatCurrency(order.totalValue)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
