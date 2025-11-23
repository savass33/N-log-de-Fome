// src/services/menuService.ts
import { api } from "./api";
import { type IMenuItem } from "../interfaces/IMenuItem";

export const menuService = {
  // Busca itens de um restaurante
  getMenuByRestaurant: async (restaurantId: string): Promise<IMenuItem[]> => {
    const response = await api.get(`/cardapio/restaurante/${restaurantId}`);
    // Adapter: Banco -> Interface
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return response.data.map((item: any) => ({
      id: item.id_item_cardapio.toString(),
      name: item.nome,
      description: item.descricao || "",
      price: item.preco,
      category: item.categoria || "Geral",
    }));
  },

  createItem: async (
    restaurantId: string,
    item: Omit<IMenuItem, "id">
  ): Promise<void> => {
    await api.post("/cardapio", {
      id_restaurante_fk: restaurantId,
      nome: item.name,
      descricao: item.description,
      preco: item.price,
      categoria: item.category,
    });
  },

  updateItem: async (id: string, item: Partial<IMenuItem>): Promise<void> => {
    await api.put(`/cardapio/${id}`, {
      nome: item.name,
      descricao: item.description,
      preco: item.price,
      categoria: item.category,
    });
  },

  deleteItem: async (id: string): Promise<void> => {
    await api.delete(`/cardapio/${id}`);
  },
};
