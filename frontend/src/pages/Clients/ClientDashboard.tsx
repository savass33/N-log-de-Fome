import React, { useEffect, useState } from "react";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; // Dados reais do usuário
import { orderService } from "../../services/orderService"; // Serviço real
import { type IOrder } from "../../interfaces/IOrder";
import { Loader } from "../../components/common/Loader";
import { formatCurrency } from "../../utils/formatCurrency";
import "../Admin/Dashboard.css";

export const ClientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [recentOrders, setRecentOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.clientId) {
      loadRecentOrders(user.clientId); // Busca pedidos DO CLIENTE, não todos
    }
  }, [user]);

  const loadRecentOrders = async (clientId: string) => {
    try {
      // Nota: Precisamos garantir que o backend tenha a rota /api/pedidos/cliente/:id
      // Se não tiver, usamos getAllOrders e filtramos no front (menos performático, mas funciona)
      // Vou assumir que criamos a rota específica na iteração anterior do index.ts
      const allOrders = await orderService.getAllOrders();

      // Filtra apenas os pedidos deste cliente e pega os 3 últimos
      const myOrders = allOrders
        .filter((o) => o.clientName === user?.name) // Filtragem provisória pelo nome ou ID se o objeto Order tiver clientId
        .slice(0, 3);

      setRecentOrders(myOrders);
    } catch (error) {
      console.error("Erro ao carregar pedidos recentes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="dashboard-container">
      <h1>Olá, {user?.name}!</h1>
      <p>O que você gostaria de pedir hoje?</p>

      <div className="dashboard-grid">
        <Card title="Acesso Rápido" className="quick-access-card">
          <div className="quick-links">
            <Link to="/client/restaurants">
              <Button>Ver Restaurantes</Button>
            </Link>
            <Link to="/client/orders">
              <Button>Meus Pedidos</Button>
            </Link>
            <Link to="/client/profile">
              <Button>Meu Perfil</Button>
            </Link>
          </div>
        </Card>

        <Card title="Últimos Pedidos" className="recent-orders-card">
          {recentOrders.length === 0 ? (
            <p style={{ color: "#666", fontStyle: "italic" }}>
              Você ainda não fez nenhum pedido.
            </p>
          ) : (
            recentOrders.map((order) => (
              <div key={order.id} className="order-summary-item">
                <div>
                  <strong>{order.restaurantName}</strong>
                  <p>Status: {order.status}</p>
                  <p style={{ fontSize: "0.85rem", color: "#555" }}>
                    {formatCurrency(order.totalValue)}
                  </p>
                </div>
                {/* A rota de detalhes precisa existir no AppRoutes para clientes */}
                {/* Se não existir, mandamos para o histórico */}
                <Link to="/client/orders">
                  <Button>Ver Detalhes</Button>
                </Link>
              </div>
            ))
          )}
        </Card>
      </div>
    </div>
  );
};
