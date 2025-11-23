import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { type IOrder } from "../../interfaces/IOrder";
import { orderService } from "../../services/orderService"; // Serviço Real
import { Loader } from "../../components/common/Loader";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import "../Admin/Admin.css";

export const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<IOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadOrder(id);
    }
  }, [id]);

  const loadOrder = async (orderId: string) => {
    setIsLoading(true);
    try {
      const data = await orderService.getOrderById(orderId);
      setOrder(data);
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar os detalhes do pedido.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helpers visuais para o Status (Mesma lógica da lista)
  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("entregue") || s.includes("concluido")) return "#d4edda";
    if (s.includes("cancelado")) return "#f8d7da";
    if (s.includes("preparo") || s.includes("andamento")) return "#fff3cd";
    return "#e2e3e5";
  };

  const getStatusTextColor = (status: string) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("entregue")) return "#155724";
    if (s.includes("cancelado")) return "#721c24";
    if (s.includes("preparo")) return "#856404";
    return "#383d41";
  };

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="admin-page-container">
        <div className="error-message" style={{ color: "red" }}>
          {error}
        </div>
        <Button onClick={() => navigate(-1)} style={{ marginTop: "20px" }}>
          Voltar
        </Button>
      </div>
    );
  }

  if (!order) return <p>Pedido não encontrado.</p>;

  return (
    <div className="admin-page-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>Detalhes do Pedido #{order.id}</h1>
        <Button
          onClick={() => navigate(-1)}
          style={{ backgroundColor: "#666" }}
        >
          Voltar
        </Button>
      </div>

      <div className="order-details-grid">
        {/* CARD DE RESUMO */}
        <Card title="Resumo do Pedido">
          <div className="order-summary-details">
            <p>
              <strong>Cliente:</strong> {order.clientName}
            </p>
            <p>
              <strong>Restaurante:</strong> {order.restaurantName}
            </p>
            <p>
              <strong>Data:</strong> {formatDate(order.createdAt)}
            </p>
            <div style={{ margin: "10px 0" }}>
              <strong>Status: </strong>
              <span
                className="status-badge"
                style={{
                  backgroundColor: getStatusColor(order.status),
                  color: getStatusTextColor(order.status),
                  padding: "4px 10px",
                  borderRadius: "15px",
                  fontWeight: "bold",
                }}
              >
                {order.status}
              </span>
            </div>
            <p style={{ fontSize: "1.2rem", marginTop: "15px" }}>
              <strong>Total:</strong> {formatCurrency(order.totalValue)}
            </p>
          </div>
        </Card>

        {/* CARD DE ITENS */}
        <Card title="Itens do Pedido">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Item</th>
                <th style={{ textAlign: "center" }}>Qtd.</th>
                <th style={{ textAlign: "right" }}>Preço Unit.</th>
                <th style={{ textAlign: "right" }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id_item}>
                  <td>
                    {/* Adaptação: O service retorna 'descricao', não 'menuItem.name' */}
                    {item.descricao}
                  </td>
                  <td style={{ textAlign: "center" }}>{item.quantidade}</td>
                  <td style={{ textAlign: "right" }}>
                    {formatCurrency(item.preco)}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <strong>
                      {formatCurrency(item.preco * item.quantidade)}
                    </strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
};
