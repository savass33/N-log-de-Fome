import { api } from "./api";
import { type IRestaurant } from "../interfaces/IRestaurant";

export const restaurantService = {
  getRestaurants: async (): Promise<IRestaurant[]> => {
    try {
      const response = await api.get("/restaurantes");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = response.data.map((dbRest: any) => ({
        id: dbRest.id_restaurante.toString(),
        name: dbRest.nome,
        cnpj: dbRest.telefone || "Sem CNPJ",

        // CORREÇÃO: Agora mapeamos o endereço real do banco
        address: dbRest.endereco || "Endereço não informado",

        // Se quiser usar o tipo de cozinha separado (adicione na interface IRestaurant se for usar)
        cuisineType: dbRest.tipo_cozinha,

        imageUrl: "",
        openingHours: "11:00 - 23:00",
        responsibleName: "Gerente",
        menu: [],
      }));

      return data;
    } catch (error) {
      console.error("Erro no RestaurantDAO:", error);
      throw error;
    }
  },

  getRestaurantById: async (id: string): Promise<IRestaurant> => {
    try {
      const response = await api.get(`/restaurantes/${id}`);
      const dbRest = response.data;

      return {
        id: dbRest.id_restaurante.toString(),
        name: dbRest.nome,
        cnpj: dbRest.telefone || "Sem CNPJ",

        // CORREÇÃO: Mapeamento real
        address: dbRest.endereco || "Endereço não informado",
        cuisineType: dbRest.tipo_cozinha,

        imageUrl: "",
        openingHours: "11:00 - 23:00",
        responsibleName: "Gerente",
        menu: [],
      };
    } catch (error) {
      console.error(`Erro ao buscar restaurante ${id}:`, error);
      throw error;
    }
  },

  // Atualize o CREATE para enviar o endereço
  createRestaurant: async (restaurant: {
    name: string;
    phone: string;
    cuisineType: string;
    email: string;
    address: string; // Novo parametro
  }): Promise<void> => {
    try {
      const payload = {
        nome: restaurant.name,
        telefone: restaurant.phone,
        tipo_cozinha: restaurant.cuisineType,
        email: restaurant.email,
        endereco: restaurant.address, // Envia para o back
      };
      await api.post("/restaurantes", payload);
    } catch (error) {
      console.error("Erro ao criar restaurante:", error);
      throw error;
    }
  },

  // Atualize o UPDATE
  updateRestaurant: async (
    id: string,
    data: {
      name?: string;
      phone?: string;
      cuisineType?: string;
      address?: string;
    }
  ): Promise<void> => {
    try {
      const payload = {
        nome: data.name,
        telefone: data.phone,
        tipo_cozinha: data.cuisineType,
        endereco: data.address,
      };
      await api.put(`/restaurantes/${id}`, payload);
    } catch (error) {
      console.error(`Erro ao atualizar restaurante ${id}:`, error);
      throw error;
    }
  },

  deleteRestaurant: async (id: string): Promise<void> => {
    // ... (mantém igual)
    try {
      await api.delete(`/restaurantes/${id}`);
    } catch (error) {
      throw error;
    }
  },
};
