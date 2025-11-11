import React from 'react';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Dashboard.css'; // Reutilizando o CSS do dashboard

// Mock de dados para esta página
const mockRecentOrders = [
  { id: '1001', clientName: 'Ana Silva', restaurantName: 'Pizza da Boa', status: 'pending' },
  { id: '1002', clientName: 'Bruno Costa', restaurantName: 'Sushi Express', status: 'preparing' },
];

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      <h1>Olá, {user?.name || 'Admin'}!</h1>
      <p>Bem-vindo ao painel de controle da NLogDeFome.</p>

      {/* 1. Métricas Principais */}
      <div className="dashboard-grid stats-grid">
        <StatsCard title="Receita (Mês)" value="R$ 12.450,00" />
        <StatsCard title="Pedidos (Hoje)" value="120" />
        <StatsCard title="Novos Clientes (Mês)" value="45" />
        <StatsCard title="Restaurantes Ativos" value="85" />
      </div>

      <div className="dashboard-grid main-grid">
        {/* 2. Ações Rápidas */}
        <Card title="Ações Rápidas" className="quick-access-card">
          <div className="quick-links">
            <Link to="/admin/restaurants"><Button>Gerenciar Restaurantes</Button></Link>
            <Link to="/admin/clients"><Button>Gerenciar Clientes</Button></Link>
            <Link to="/admin/support"><Button>Ver Tickets de Suporte</Button></Link>
            <Link to="/admin/analytics"><Button>Ver Analytics Completos</Button></Link>
          </div>
        </Card>

        {/* 3. Pedidos Recentes */}
        <Card title="Pedidos Pendentes" className="recent-orders-card">
          {mockRecentOrders.map(order => (
            <div key={order.id} className="order-summary-item">
              <div>
                <strong>Pedido #{order.id}</strong>
                <p>Cliente: {order.clientName} | Restaurante: {order.restaurantName}</p>
              </div>
              <Link to={`/admin/orders/${order.id}`}><Button>Ver Detalhes</Button></Link>
            </div>
          ))}
          {mockRecentOrders.length === 0 && (
            <p>Nenhum pedido pendente no momento.</p>
          )}
        </Card>
      </div>
    </div>
  );
};