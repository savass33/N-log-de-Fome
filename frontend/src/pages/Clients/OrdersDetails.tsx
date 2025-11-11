import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card } from "../../components/common/Card";
import { type IOrder } from "../../interfaces/IOrder";
import { Loader } from "../../components/common/Loader";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import "./Admin.css"; // Reutilizando e atualizando o Admin.css

// Mock de dados (um service buscaria isso pelo ID)
const mockOrder: IOrder = {
  id: "1001",
  clientId: "c1",
  clientName: "Ana Silva",
  restaurantId: "r1",
  restaurantName: "Pizza da Boa",
  status: "pending",
  createdAt: new Date(Date.now() - 100000).toISOString(),
  totalValue: 55.5,
  items: [
    {
      menuItem: {
        id: "m1",
        name: "Pizza Margherita",
        price: 35.0,
        description: "",
        imageUrl: "",
        category: "Pizzas",
      },
      quantity: 1,
      observation: "Sem cebola",
    },
    {
      menuItem: {
        id: "m2",
        name: "Refrigerante",
        price: 10.25,
        description: "",
        imageUrl: "",
        category: "Bebidas",
      },
      quantity: 2,
    },
  ],
};

export const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simula busca na API
    setTimeout(() => {
      setOrder(mockOrder);
      setIsLoading(false);
    }, 500);
  }, [id]);

  if (isLoading) return <Loader />;
  if (!order) return <p>Pedido não encontrado.</p>;

  return (
    <div className="admin-page-container">
      <h1>Detalhes do Pedido #{order.id}</h1>

      <div className="order-details-grid">
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
            <p>
              <strong>Status:</strong>{" "}
              <span className={`status-badge status-${order.status}`}>
                {order.status}
              </span>
            </p>
            <p>
              <strong>Total:</strong> {formatCurrency(order.totalValue)}
            </p>
          </div>
        </Card>

        <Card title="Itens do Pedido">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qtd.</th>
                <th>Preço Unit.</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.menuItem.id}>
                  <td>
                    {item.menuItem.name}
                    {item.observation && (
                      <span className="item-observation">
                        ({item.observation})
                      </span>
                    )}
                  </td>
                  <td>{item.quantity}</td>
                  <td>{formatCurrency(item.menuItem.price)}</td>
                  <td>{formatCurrency(item.menuItem.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
};
