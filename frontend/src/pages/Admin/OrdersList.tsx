import React, { useEffect, useState } from "react";
import { type IOrder } from "../../interfaces/IOrder";
import { orderService } from "../../services/orderService"; // Serviço Real
import { Loader } from "../../components/common/Loader";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import "./Admin.css";

export const OrdersList: React.FC = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    setIsLoading(true);
    orderService.getAllOrders()
      .then(data => {
        setOrders(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Erro ao carregar pedidos. Backend ativo?");
        setIsLoading(false);
      });
  };

  if (isLoading) return <Loader />;

  return (
    <div className="admin-page-container">
      <h1>Histórico de Pedidos</h1>

      {error && <div className="error-message" style={{color: 'red', marginBottom: '20px'}}>{error}</div>}

      {orders.length === 0 && !error ? (
         <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <p>Nenhum pedido registrado no sistema.</p>
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Restaurante</th>
              <th>Data</th>
              <th>Status</th>
              <th>Itens</th>
              <th>Total</th>
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
                  <span className="status-badge">
                    {order.status}
                  </span>
                </td>
                <td style={{ fontSize: '0.85rem', color: '#555' }}>
                  {order.items.map(i => (
                    <div key={i.id_item}>
                      {i.quantidade}x {i.descricao}
                    </div>
                  ))}
                </td>
                <td><strong>{formatCurrency(order.totalValue)}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};