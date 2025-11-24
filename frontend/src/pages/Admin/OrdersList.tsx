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
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "5%" }}>ID</th>
                <th style={{ width: "20%" }}>Cliente</th>
                <th style={{ width: "20%" }}>Restaurante</th>
                <th style={{ width: "15%" }}>Data</th>
                <th style={{ width: "15%" }}>Status</th>
                <th style={{ width: "15%", textAlign: "right" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                return (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.clientName}</td>
                    <td>{order.restaurantName}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>
                      <span
                        className="status-badge"
                        style={{
                          backgroundColor: statusConfig.bg,
                          color: statusConfig.color,
                          padding: "6px 12px",
                          borderRadius: "20px",
                          fontWeight: "bold",
                          fontSize: "0.85rem",
                          border: `1px solid ${statusConfig.color}20`,
                          display: "inline-block",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {statusConfig.label}
                      </span>
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        fontWeight: "bold",
                        color: "#28a745",
                      }}
                    >
                      {formatCurrency(order.totalValue)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
