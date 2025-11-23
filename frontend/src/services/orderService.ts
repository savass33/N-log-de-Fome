import { api } from './api';
import { type IOrder, type IOrderItem } from '../interfaces/IOrder';

export const orderService = {
  
  getAllOrders: async (): Promise<IOrder[]> => {
    try {
      const response = await api.get('/pedidos');
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = response.data.map((dbOrder: any) => {
        
        // CORREÇÃO: Acessar iTEMPEDIDO (gerado pelo Prisma)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const itemsList = dbOrder.iTEMPEDIDO || []; 

        // Calcular total
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const total = itemsList.reduce((acc: number, item: any) => {
          return acc + (item.quantidade * item.preco);
        }, 0);

        return {
          id: dbOrder.id_pedido.toString(),
          
          // CORREÇÃO: Acessar objetos em minúsculas
          clientName: dbOrder.cliente?.nome || 'Cliente Desconhecido',
          restaurantName: dbOrder.restaurante?.nome || 'Restaurante Desconhecido',
          
          status: dbOrder.status_pedido,
          createdAt: dbOrder.data_hora,
          totalValue: total,
          
          // Mapear Itens
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          items: itemsList.map((item: any) => ({
            id_item: item.id_item,
            descricao: item['descrição'] || item.descricao || 'Item',
            quantidade: item.quantidade,
            preco: item.preco
          } as IOrderItem))
        };
      });

      return data;
    } catch (error) {
      console.error("Erro no OrderDAO:", error);
      throw error;
    }
  }
};