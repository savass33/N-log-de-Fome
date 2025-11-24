export type OrderStatus =
  | "pending"
  | "preparing"
  | "on_the_way"
  | "delivered"
  | "canceled";

export interface IOrderItem {
  id_item: number;
  descricao: string;
  quantidade: number;
  preco: number;
  menuItem?: { id: string; name: string };
}

export interface IOrder {
  id: string;
  clientName: string;
  restaurantName: string;
  status: OrderStatus;
  createdAt: string;
  totalValue: number;
  items: IOrderItem[];
}
