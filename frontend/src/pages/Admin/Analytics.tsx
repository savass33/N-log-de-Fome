import React from 'react';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { OrderChart } from '../../components/dashboard/OrderChart';
import { RestaurantPerformance } from '../../components/dashboard/RestaurantPerfomance';
import '../Dashboard/Dashboard.css'; // Reutilizando o CSS do dashboard

export const Analytics: React.FC = () => {
  return (
    <div className="dashboard-container">
      <h1>Analytics da Plataforma</h1>
      
      <div className="dashboard-grid stats-grid">
        <StatsCard title="Receita Total" value="R$ 150.780,50" />
        <StatsCard title="Total de Pedidos" value="10.212" />
        <StatsCard title="Novos Clientes (Mês)" value="315" />
        <StatsCard title="Restaurantes Ativos" value="85" />
      </div>
      
      <div className="dashboard-grid charts-grid">
        <OrderChart />
        <RestaurantPerformance />
      </div>
    </div>
  );
};