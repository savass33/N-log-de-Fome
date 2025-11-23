// src/interfaces/IOrder.ts

// Definição estrita dos status possíveis no Frontend
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
  menuItem?: { id: string; name: string }; // Opcional, dependendo do seu uso
}

export interface IOrder {
  id: string;
  clientName: string;
  restaurantName: string;
  status: OrderStatus; // Aqui usamos o tipo estrito
  createdAt: string; // ou Date, dependendo de como você trata
  totalValue: number;
  items: IOrderItem[];
}
