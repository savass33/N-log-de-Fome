import { api } from "./api";
import {
  type IOrder,
  type IOrderItem,
  type OrderStatus,
} from "../interfaces/IOrder";

// --- HELPERS EXISTENTES (Mantidos) ---
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
  const itemsList = dbOrder.iTEMPEDIDO || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const total = itemsList.reduce((acc: number, item: any) => {
    return acc + item.quantidade * item.preco;
  }, 0);

  return {
    id: dbOrder.id_pedido.toString(),
    clientName: dbOrder.cliente?.nome || "Cliente Desconhecido",
    restaurantName: dbOrder.restaurante?.nome || "Restaurante Desconhecido",
    status: mapStatus(dbOrder.status_pedido),
    createdAt: dbOrder.data_hora,
    totalValue: total,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: itemsList.map(
      (item: any) =>
        ({
          id_item: item.id_item,
          descricao: item["descrição"] || item.descricao || "Item",
          quantidade: item.quantidade,
          preco: item.preco,
        } as IOrderItem)
    ),
  };
};

export const orderService = {
  // --- MÉTODOS EXISTENTES (Mantidos) ---
  getAllOrders: async (): Promise<IOrder[]> => {
    const response = await api.get("/pedidos");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return response.data.map((dbOrder: any) => mapDbOrderToIOrder(dbOrder));
  },

  getOrdersByRestaurant: async (restaurantId: string): Promise<IOrder[]> => {
    const response = await api.get("/pedidos");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return response.data.map((dbOrder: any) => mapDbOrderToIOrder(dbOrder));
  },

  updateOrderStatus: async (
    orderId: string,
    newStatus: OrderStatus
  ): Promise<void> => {
    let statusParaEnviar = newStatus;
    // Lógica de fallback para compatibilidade com backend SQL restrito (se necessário)
    if (
      newStatus === "pending" ||
      newStatus === "canceled" ||
      newStatus === "on_the_way"
    ) {
      // Exemplo: se o banco for restrito, descomente abaixo ou mantenha como está se já atualizou o banco
      // statusParaEnviar = 'Preparando';
    }

    await api.put(`/pedidos/${orderId}`, { status_pedido: statusParaEnviar });
  },

  // --- NOVAS FUNCIONALIDADES ESSENCIAIS ---

  // 1. Buscar detalhes de um pedido específico
  getOrderById: async (orderId: string): Promise<IOrder> => {
    try {
      const response = await api.get(`/pedidos/${orderId}`);
      return mapDbOrderToIOrder(response.data);
    } catch (error) {
      console.error(`Erro ao buscar pedido ${orderId}:`, error);
      throw error;
    }
  },

  // 2. Criar um novo pedido (Checkout)
  // Payload genérico baseado na estrutura do banco
  createOrder: async (orderData: {
    clientId: number;
    restaurantId: number;
    items: { descricao: string; quantidade: number; preco: number }[];
  }): Promise<void> => {
    try {
      // Adapter: Frontend -> Backend (snake_case)
      const payload = {
        id_cliente_fk: orderData.clientId,
        id_restaurante_fk: orderData.restaurantId,
        data_hora: new Date(), // Ou deixar o banco gerar com NOW()
        status_pedido: "Pendente",
        // O backend precisa estar preparado para receber 'itens' no corpo,
        // ou você terá que fazer chamadas separadas para ITEMPEDIDO
        itens: orderData.items,
      };

      await api.post("/pedidos", payload);
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      throw error;
    }
  },
};
