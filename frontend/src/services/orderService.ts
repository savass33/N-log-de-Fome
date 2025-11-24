import { api } from "./api";
import {
  type IOrder,
  type IOrderItem,
  type OrderStatus,
} from "../interfaces/IOrder";

const mapStatus = (statusBanco: string, id?: string): OrderStatus => {
  const status = statusBanco?.toLowerCase() || "";

  let result: OrderStatus = "pending";

  if (status.includes("aberto") || status.includes("pendente"))
    result = "pending";
  else if (
    status.includes("preparo") ||
    status.includes("preparando") ||
    status.includes("cozinha")
  )
    result = "preparing";
  else if (status.includes("caminho") || status.includes("transporte"))
    result = "on_the_way";
  else if (status.includes("entregue") || status.includes("concluido"))
    result = "delivered";
  else if (status.includes("cancelado")) result = "canceled";
  return result;
};

const mapDbOrderToIOrder = (dbOrder: any): IOrder => {
  const itemsList =
    dbOrder.itempedido || dbOrder.ItemPedido || dbOrder.iTEMPEDIDO || [];

  const total = itemsList.reduce((acc: number, item: any) => {
    const qtd = Number(item.quantidade) || 0;
    const prc = Number(item.preco) || 0;
    return acc + qtd * prc;
  }, 0);

  return {
    id: dbOrder.id_pedido.toString(),
    clientName: dbOrder.cliente?.nome || "Cliente Desconhecido",
    restaurantName: dbOrder.restaurante?.nome || "Restaurante Desconhecido",

    status: mapStatus(dbOrder.status_pedido, dbOrder.id_pedido),

    createdAt: dbOrder.data_hora,
    totalValue: total,
    items: itemsList.map(
      (item: any) =>
        ({
          id_item: item.id_item,
          descricao:
            item.descri__o || item.descricao || item.descri__o || "Item",
          quantidade: Number(item.quantidade),
          preco: Number(item.preco),
        } as IOrderItem)
    ),
  };
};

export const orderService = {
  getAllOrders: async (): Promise<IOrder[]> => {
    const response = await api.get("/pedidos");
    return response.data.map((dbOrder: any) => mapDbOrderToIOrder(dbOrder));
  },

  getOrdersByRestaurant: async (restaurantId: string): Promise<IOrder[]> => {
    const response = await api.get(`/pedidos/restaurante/${restaurantId}`);
    console.log("📦 [Raw Fetch] Pedidos recebidos:", response.data);
    return response.data.map((dbOrder: any) => mapDbOrderToIOrder(dbOrder));
  },

  getOrdersByClient: async (clientId: string): Promise<IOrder[]> => {
    const response = await api.get(`/pedidos/cliente/${clientId}`);
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
      itens: orderData.items,
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
