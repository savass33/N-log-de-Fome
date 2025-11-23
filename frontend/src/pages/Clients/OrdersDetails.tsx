import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { type IOrder } from "../../interfaces/IOrder";
import { orderService } from "../../services/orderService";
import { Loader } from "../../components/common/Loader";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import "../Admin/Admin.css"; // Mantemos para estilos globais, mas usamos inline para ajustes finos

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

  // --- Lógica de Cores e Textos (Padronizada com OrdersHistory) ---
  const getStatusConfig = (status: string) => {
    const s = status?.toLowerCase() || "";

    if (s.includes("pendente") || s.includes("pending"))
      return { bg: "#fff3cd", color: "#856404", label: "Pendente" };
    if (s.includes("preparando") || s.includes("preparing"))
      return { bg: "#ffecb5", color: "#664d03", label: "Em Preparo" };
    if (s.includes("caminho") || s.includes("way"))
      return { bg: "#cff4fc", color: "#055160", label: "A Caminho" };
    if (s.includes("entregue") || s.includes("delivered"))
      return { bg: "#d1e7dd", color: "#0f5132", label: "Entregue" };
    if (s.includes("cancelado") || s.includes("canceled"))
      return { bg: "#f8d7da", color: "#842029", label: "Cancelado" };

    return { bg: "#e2e3e5", color: "#383d41", label: status };
  };

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="admin-page-container">
        <div
          className="error-message"
          style={{
            color: "#721c24",
            backgroundColor: "#f8d7da",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
        <Button onClick={() => navigate(-1)}>Voltar</Button>
      </div>
    );
  }

  if (!order) return <p>Pedido não encontrado.</p>;

  const statusStyle = getStatusConfig(order.status);

  return (
    <div className="admin-page-container">
      {/* Cabeçalho da Página */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h1 style={{ margin: 0 }}>Pedido #{order.id}</h1>
        <Button
          onClick={() => navigate(-1)}
          style={{ backgroundColor: "#6c757d", fontSize: "0.9rem" }}
        >
          Voltar
        </Button>
      </div>

      <div className="order-details-grid">
        {/* CARD 1: Informações Gerais */}
        <Card title="Resumo do Pedido">
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {/* Badge de Status em Destaque */}
            <div
              style={{
                alignSelf: "flex-start",
                backgroundColor: statusStyle.bg,
                color: statusStyle.color,
                padding: "10px 20px",
                borderRadius: "50px",
                fontWeight: "bold",
                fontSize: "1rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                border: `1px solid ${statusStyle.color}30`,
                marginBottom: "10px",
              }}
            >
              {statusStyle.label}
            </div>

            <div style={{ fontSize: "1.05rem" }}>
              <strong>Restaurante:</strong> <br />
              <span style={{ color: "#555" }}>{order.restaurantName}</span>
            </div>

            <div style={{ fontSize: "1.05rem" }}>
              <strong>Data do Pedido:</strong> <br />
              <span style={{ color: "#555" }}>
                {formatDate(order.createdAt)}
              </span>
            </div>

            <hr
              style={{
                border: "0",
                borderTop: "1px solid #eee",
                margin: "10px 0",
              }}
            />

            {/* Total em Destaque */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#f8f9fa",
                padding: "15px",
                borderRadius: "8px",
              }}
            >
              <span style={{ fontSize: "1.1rem", color: "#555" }}>
                Total Pago:
              </span>
              <strong style={{ fontSize: "1.6rem", color: "#28a745" }}>
                {formatCurrency(order.totalValue)}
              </strong>
            </div>
          </div>
        </Card>

        {/* CARD 2: Lista de Itens */}
        <Card title="Itens Comprados">
          {order.items.length === 0 ? (
            <p style={{ color: "#999", fontStyle: "italic" }}>
              Nenhum item registrado neste pedido.
            </p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: "50%" }}>Item</th>
                  <th style={{ textAlign: "center", width: "15%" }}>Qtd.</th>
                  <th style={{ textAlign: "right", width: "15%" }}>Unit.</th>
                  <th style={{ textAlign: "right", width: "20%" }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id_item}>
                    <td>
                      <div style={{ fontWeight: "600", color: "#333" }}>
                        {item.descricao}
                      </div>
                    </td>
                    <td style={{ textAlign: "center", color: "#666" }}>
                      {item.quantidade}
                    </td>
                    <td style={{ textAlign: "right", color: "#666" }}>
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
          )}
        </Card>
      </div>
    </div>
  );
};
