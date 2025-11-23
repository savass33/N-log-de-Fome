import { api } from "./api";
import {
  type IOrder,
  type IOrderItem,
  type OrderStatus,
} from "../interfaces/IOrder";

// Helper para status (Mantido)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapStatus = (statusBanco: string): OrderStatus => {
  const status = statusBanco?.toLowerCase() || "";
  if (status.includes("aberto") || status.includes("pendente"))
    return "pending";
  if (status.includes("preparo") || status.includes("cozinha"))
    return "preparing";
  if (status.includes("caminho") || status.includes("transporte"))
    return "on_the_way";
  if (status.includes("entregue") || status.includes("concluido"))
    return "delivered";
  if (status.includes("cancelado")) return "canceled";
  return "pending";
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapDbOrderToIOrder = (dbOrder: any): IOrder => {
  // CORREÇÃO: O Prisma geralmente retorna o nome do model em minúsculo (itempedido)
  // Fazemos um fallback para garantir que pegue de qualquer jeito.
  const itemsList =
    dbOrder.itempedido || dbOrder.ItemPedido || dbOrder.iTEMPEDIDO || [];

  // CORREÇÃO: Cálculo do total blindado (garante que sejam números)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const total = itemsList.reduce((acc: number, item: any) => {
    const qtd = Number(item.quantidade) || 0;
    const prc = Number(item.preco) || 0;
    return acc + qtd * prc;
  }, 0);

  return {
    id: dbOrder.id_pedido.toString(),
    // Tenta pegar o nome do objeto cliente/restaurante ou usa placeholder
    clientName: dbOrder.cliente?.nome || "Cliente Desconhecido",
    restaurantName: dbOrder.restaurante?.nome || "Restaurante Desconhecido",
    status: mapStatus(dbOrder.status_pedido),
    createdAt: dbOrder.data_hora,
    totalValue: total, // Total calculado corretamente aqui

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: itemsList.map(
      (item: any) =>
        ({
          id_item: item.id_item,
          // Verifica se vem como 'descri__o' (banco legado) ou 'descricao'
          descricao:
            item.descrição || item.descricao || item.descri__o || "Item",
          quantidade: Number(item.quantidade),
          preco: Number(item.preco),
        } as IOrderItem)
    ),
  };
};

export const orderService = {
  getAllOrders: async (): Promise<IOrder[]> => {
    const response = await api.get("/pedidos");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return response.data.map((dbOrder: any) => mapDbOrderToIOrder(dbOrder));
  },

  getOrdersByRestaurant: async (restaurantId: string): Promise<IOrder[]> => {
    // Usa a rota específica criada no index.ts
    const response = await api.get(`/pedidos/restaurante/${restaurantId}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return response.data.map((dbOrder: any) => mapDbOrderToIOrder(dbOrder));
  },

  // NOVA FUNÇÃO IMPORTANTE PARA O DASHBOARD DO CLIENTE
  getOrdersByClient: async (clientId: string): Promise<IOrder[]> => {
    const response = await api.get(`/pedidos/cliente/${clientId}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return response.data.map((dbOrder: any) => mapDbOrderToIOrder(dbOrder));
  },

  getOrderById: async (orderId: string): Promise<IOrder> => {
    const response = await api.get(`/pedidos/${orderId}`);
    return mapDbOrderToIOrder(response.data);
  },

  createOrder: async (orderData: {
    clientId: number;
    restaurantId: number;
    items: { descricao: string; quantidade: number; preco: number }[];
  }): Promise<void> => {
    const payload = {
      id_cliente_fk: orderData.clientId,
      id_restaurante_fk: orderData.restaurantId,
      data_hora: new Date(),
      status_pedido: "Pendente",
      items: orderData.items,
    };
    await api.post("/pedidos", payload);
  },

  updateOrderStatus: async (
    orderId: string,
    newStatus: OrderStatus
  ): Promise<void> => {
    await api.put(`/pedidos/${orderId}`, { status_pedido: newStatus });
  },
};
