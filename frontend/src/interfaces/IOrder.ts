import { type IMenuItem } from './IMenuItem';

export type OrderStatus = 'pending' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';

// Item *dentro* de um pedido
export interface IOrderItem {
  menuItem: IMenuItem;
  quantity: number;
  observation?: string;
}

export interface IOrder {
  id: string;
  clientId: string; // ID do cliente
  restaurantId: string; // ID do restaurante
  items: IOrderItem[];
  totalValue: number;
  status: OrderStatus;
  createdAt: string;
  // Opcional: podemos carregar os objetos completos depois
  clientName?: string; 
  restaurantName?: string;
}