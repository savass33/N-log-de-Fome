export type OrderStatus = 'Preparando' | 'Entregue' | 'Caminho'; // Valores do seu ENUM no banco

export interface IOrderItem {
  id_item: number;
  descricao: string; // No banco é "descrição", vamos mapear
  quantidade: number;
  preco: number;
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