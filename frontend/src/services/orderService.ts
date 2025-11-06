import { type IOrder, type OrderStatus } from '../interfaces/IOrder';

// Dados mockados
const MOCK_ORDERS: IOrder[] = [
  {
    id: '1001',
    clientId: 'c1',
    clientName: 'Ana Silva',
    restaurantId: 'r1',
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    totalValue: 55.50,
    items: [
      {
        menuItem: { id: 'm1', name: 'Pizza Margherita', price: 35.00, description: '', imageUrl: '', category: 'Pizzas' },
        quantity: 1,
        observation: 'Sem cebola',
      },
      {
        menuItem: { id: 'm2', name: 'Refrigerante', price: 10.25, description: '', imageUrl: '', category: 'Bebidas' },
        quantity: 2,
      },
    ],
  },
  {
    id: '1002',
    clientId: 'c2',
    clientName: 'Bruno Costa',
    restaurantId: 'r1',
    status: 'preparing',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    totalValue: 80.00,
    items: [
      {
        menuItem: { id: 'm3', name: 'Hambúrguer Duplo', price: 40.00, description: '', imageUrl: '', category: 'Lanches' },
        quantity: 2,
      },
    ],
  },
  {
    id: '1003',
    clientId: 'c3',
    clientName: 'Carla Dias',
    restaurantId: 'r1',
    status: 'on_the_way',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    totalValue: 25.00,
    items: [
      {
        menuItem: { id: 'm4', name: 'Açaí 500ml', price: 25.00, description: '', imageUrl: '', category: 'Sobremesas' },
        quantity: 1,
      },
    ],
  },
];

// Simula uma chamada de API
const getOrdersByRestaurant = (restaurantId: string): Promise<IOrder[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_ORDERS.filter(order => order.restaurantId === restaurantId));
    }, 500); // Simula delay da rede
  });
};

// Simula uma atualização
const updateOrderStatus = (orderId: string, status: OrderStatus): Promise<IOrder> => {
   return new Promise((resolve, reject) => {
    setTimeout(() => {
      const orderIndex = MOCK_ORDERS.findIndex(o => o.id === orderId);
      if (orderIndex === -1) {
        return reject(new Error('Pedido não encontrado'));
      }
      MOCK_ORDERS[orderIndex].status = status;
      resolve(MOCK_ORDERS[orderIndex]);
    }, 300);
  });
}

export const orderService = {
  getOrdersByRestaurant,
  updateOrderStatus
};