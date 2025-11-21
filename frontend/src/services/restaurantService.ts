import { api } from './api';
import { type IRestaurant } from '../interfaces/IRestaurant';

// RESTAURANT DAO
export const restaurantService = {
  
  // Método para buscar todos os restaurantes (SELECT * FROM RESTAURANTE)
  getRestaurants: async (): Promise<IRestaurant[]> => {
    try {
      const response = await api.get('/restaurantes');
      
      // Adapter: Banco de Dados -> Frontend
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = response.data.map((dbRest: any) => ({
        id: dbRest.id_restaurante.toString(),
        name: dbRest.nome,
        
        // Adaptações criativas para campos faltantes no banco
        cnpj: dbRest.telefone || 'Sem CNPJ', // Usamos telefone como identificador visual
        address: `Tipo: ${dbRest.tipo_cozinha}`, // Mostramos o tipo de cozinha no endereço
        
        // Valores Padrão para UI
        imageUrl: '', 
        openingHours: '11:00 - 23:00',
        responsibleName: 'Gerente',
        menu: []
      }));

      return data;
    } catch (error) {
      console.error("Erro no RestaurantDAO (getRestaurants):", error);
      throw error;
    }
  },
};