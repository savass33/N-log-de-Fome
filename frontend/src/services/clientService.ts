import { api } from './api';
import { type IClient } from '../interfaces/IClient';

// CLIENT DAO (Data Access Object)
export const clientService = {
  
  // Método para buscar todos os clientes (SELECT * FROM CLIENTE)
  getClients: async (): Promise<IClient[]> => {
    try {
      // 1. Chamada HTTP ao Backend
      const response = await api.get('/clientes');
      
      // 2. Adapter (Mapeamento): Banco de Dados (snake_case) -> Frontend (camelCase)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = response.data.map((dbClient: any) => ({
        id: dbClient.id_cliente.toString(),
        name: dbClient.nome || 'Sem Nome',
        
        // Tratamento para campos que existem na Interface mas não na Tabela
        email: dbClient.email || '-', // Lê o email se existir, senão usa placeholder
        phone: dbClient.telefone || '',
        address: dbClient.endereco || '',
        
        // Gera uma data atual pois a tabela CLIENTE não tem createdAt
        createdAt: new Date().toISOString(), 
      }));

      return data;
    } catch (error) {
      console.error("Erro no ClientDAO (getClients):", error);
      throw error;
    }
  },
};