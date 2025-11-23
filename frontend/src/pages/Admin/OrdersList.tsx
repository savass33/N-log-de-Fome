import React, { useEffect, useState } from "react";
import { type IOrder } from "../../interfaces/IOrder";
import { orderService } from "../../services/orderService";
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
    orderService
      .getAllOrders()
      .then((data) => {
        setOrders(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Erro ao carregar pedidos. Backend ativo?");
        setIsLoading(false);
      });
  };

  const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower.includes("entregue") || statusLower.includes("concluido"))
      return "#d4edda";
    if (statusLower.includes("cancelado")) return "#f8d7da";
    if (statusLower.includes("preparo") || statusLower.includes("andamento"))
      return "#fff3cd";
    return "#e2e3e5";
  };

  const getStatusTextColor = (status: string) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower.includes("entregue") || statusLower.includes("concluido"))
      return "#155724";
    if (statusLower.includes("cancelado")) return "#721c24";
    if (statusLower.includes("preparo") || statusLower.includes("andamento"))
      return "#856404";
    return "#383d41";
  };

  if (isLoading) return <Loader />;

  return (
    <div className="admin-page-container">
      <h1>Histórico de Pedidos</h1>

      {error && (
        <div
          className="error-message"
          style={{ color: "red", marginBottom: "20px" }}
        >
          {error}
        </div>
      )}

      {orders.length === 0 && !error ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
          <p>Nenhum pedido registrado no sistema.</p>
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: "5%" }}>ID</th>
              <th style={{ width: "15%" }}>Cliente</th>
              <th style={{ width: "15%" }}>Restaurante</th>
              <th style={{ width: "15%" }}>Data</th>
              <th style={{ width: "10%" }}>Status</th>
              <th style={{ width: "15%" }}>Total</th>
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
                  <span
                    className="status-badge"
                    style={{
                      backgroundColor: getStatusColor(order.status),
                      color: getStatusTextColor(order.status),
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontWeight: "bold",
                      fontSize: "0.85rem",
                    }}
                  >
                    {order.status}
                  </span>
                </td>
                <td>
                  <strong>{formatCurrency(order.totalValue)}</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
