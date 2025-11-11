import React, { useEffect, useState } from 'react';
import { type IOrder, type OrderStatus } from '../../interfaces/IOrder';
import { orderService } from '../../services/orderService';
import { Card } from '../../components/common/Card';
import './OrdersManagement.css';
import { Loader } from '../../components/common/Loader'; // (será um scaffold)
import { Button } from '../../components/common/Button'; // (será um scaffold)

// Um helper para traduzir o status
const getStatusLabel = (status: OrderStatus) => {
  switch (status) {
    case 'pending': return 'Pendente';
    case 'preparing': return 'Em Preparo';
    case 'on_the_way': return 'A Caminho';
    case 'delivered': return 'Entregue';
    case 'cancelled': return 'Cancelado';
  }
};

export const OrdersManagement: React.FC = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock ID do restaurante logado
  const myRestaurantId = 'r1';

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    setIsLoading(true);
    orderService.getOrdersByRestaurant(myRestaurantId)
      .then(setOrders)
      .catch(() => setError('Falha ao buscar pedidos.'))
      .finally(() => setIsLoading(false));
  };

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    // Atualiza o estado local primeiro para UI instantânea
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    
    // Envia para o "backend"
    orderService.updateOrderStatus(orderId, newStatus)
      .catch(() => {
        // Reverte em caso de erro
        setError('Falha ao atualizar status. Tentando novamente...');
        loadOrders(); // Recarrega os dados originais
      });
  };

  if (isLoading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;

  const columns: OrderStatus[] = ['pending', 'preparing', 'on_the_way'];

  return (
    <div className="orders-management-page">
      <h1>Gerenciamento de Pedidos</h1>
      
      <div className="orders-kanban-board">
        {columns.map(status => (
          <div key={status} className="kanban-column">
            <h2>{getStatusLabel(status)}</h2>
            <div className="kanban-column-content">
              {orders
                .filter(order => order.status === status)
                .map(order => (
                  <Card key={order.id} className="order-card">
                    <strong>Pedido #{order.id} - {order.clientName}</strong>
                    <ul>
                      {order.items.map(item => (
                        <li key={item.menuItem.id}>
                          {item.quantity}x {item.menuItem.name}
                        </li>
                      ))}
                    </ul>
                    <div className="order-card-actions">
                      {status === 'pending' && (
                        <Button onClick={() => handleUpdateStatus(order.id, 'preparing')}>
                          Aceitar Pedido
                        </Button>
                      )}
                       {status === 'preparing' && (
                        <Button onClick={() => handleUpdateStatus(order.id, 'on_the_way')}>
                          Marcar como "A Caminho"
                        </Button>
                      )}
                       {status === 'on_the_way' && (
                        <Button onClick={() => handleUpdateStatus(order.id, 'delivered')}>
                          Finalizar Entrega
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};