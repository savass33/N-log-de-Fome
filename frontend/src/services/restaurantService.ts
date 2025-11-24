import { api } from "./api";
import { type IRestaurant } from "../interfaces/IRestaurant";

export const restaurantService = {
  getRestaurants: async (): Promise<IRestaurant[]> => {
    try {
      const response = await api.get("/restaurantes");

      const data = response.data.map((dbRest: any) => ({
        id: dbRest.id_restaurante.toString(),
        name: dbRest.nome,
        cnpj: dbRest.telefone || "Sem CNPJ",
        address: dbRest.endereco || "Endereço não informado",
        cuisineType: dbRest.tipo_cozinha,
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
        address: dbRest.endereco || "",
        cuisineType: dbRest.tipo_cozinha || "",
        email: dbRest.email || "",
        openingHours: "11:00 - 23:00",
        responsibleName: "Gerente",
        menu: [],
      };
    } catch (error) {
      console.error(`Erro ao buscar restaurante ${id}:`, error);
      throw error;
    }
  },

  createRestaurant: async (restaurant: {
    name: string;
    phone: string;
    cuisineType: string;
    email: string;
    address: string;
  }): Promise<void> => {
    try {
      const payload = {
        nome: restaurant.name,
        telefone: restaurant.phone,
        tipo_cozinha: restaurant.cuisineType,
        email: restaurant.email,
        endereco: restaurant.address,
      };
      await api.post("/restaurantes", payload);
    } catch (error) {
      console.error("Erro ao criar restaurante:", error);
      throw error;
    }
  },

  updateRestaurant: async (
    id: string,
    data: {
      name?: string;
      phone?: string;
      cuisineType?: string;
      email?: string;
      address?: string;
    }
  ): Promise<void> => {
    const payload = {
      nome: data.name,
      telefone: data.phone,
      tipo_cozinha: data.cuisineType,
      email: data.email,
      endereco: data.address,
    };
    await api.put(`/restaurantes/${id}`, payload);
  },

  deleteRestaurant: async (id: string): Promise<void> => {
    try {
      await api.delete(`/restaurantes/${id}`);
    } catch (error) {
      throw error;
    }
  },
};
