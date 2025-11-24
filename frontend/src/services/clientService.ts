import { api } from "./api";
import { type IClient } from "../interfaces/IClient";

export const clientService = {
  getClients: async (): Promise<IClient[]> => {
    try {
      const response = await api.get("/clientes");
      const data = response.data.map((dbClient: any) => ({
        id: dbClient.id_cliente.toString(),
        name: dbClient.nome || "Sem Nome",
        email: dbClient.email || "-",
        phone: dbClient.telefone || "",
        address: dbClient.endereco || "",
        createdAt: new Date().toISOString(),
      }));
      return data;
    } catch (error) {
      console.error("Erro no ClientDAO (getClients):", error);
      throw error;
    }
  },

  getClientById: async (id: string): Promise<IClient> => {
    try {
      const response = await api.get(`/clientes/${id}`);
      const dbClient = response.data;

      return {
        id: dbClient.id_cliente.toString(),
        name: dbClient.nome,
        email: dbClient.email || "-",
        phone: dbClient.telefone || "",
        address: dbClient.endereco || "",
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error(`Erro ao buscar cliente ${id}:`, error);
      throw error;
    }
  },

  createClient: async (
    client: Omit<IClient, "id" | "createdAt">
  ): Promise<void> => {
    try {
      const payload = {
        nome: client.name,
        email: client.email,
        telefone: client.phone,
        endereco: client.address,
      };
      await api.post("/clientes", payload);
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
      throw error;
    }
  },

  updateClient: async (id: string, client: Partial<IClient>): Promise<void> => {
    try {
      const payload = {
        nome: client.name,
        email: client.email,
        telefone: client.phone,
        endereco: client.address,
      };
      await api.put(`/clientes/${id}`, payload);
      console.log("Entrou aqui nesse cabaré");
    } catch (error) {
      console.error(`Erro ao atualizar cliente ${id}:`, error);
      console.log("Entrou aqui nesse puteiro");
      throw error;
    }
  },

  deleteClient: async (id: string): Promise<void> => {
    try {
      await api.delete(`/clientes/${id}`);
    } catch (error) {
      console.error(`Erro ao deletar cliente ${id}:`, error);
      throw error;
    }
  },
};
