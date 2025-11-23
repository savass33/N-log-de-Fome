import { type IMenuItem } from "./IMenuItem";

export interface IRestaurant {
  id: string;
  name: string;
  cnpj: string;
  address: string; // Agora será o endereço REAL, não o tipo de cozinha
  cuisineType: string; // Adicione este campo se quiser separar as coisas
  imageUrl: string;
  openingHours: string;
  responsibleName: string;
  menu: IMenuItem[];
}
