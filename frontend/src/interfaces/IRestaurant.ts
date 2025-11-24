import { type IMenuItem } from "./IMenuItem";

export interface IRestaurant {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  address: string;
  cuisineType: string;
  openingHours: string;
  responsibleName: string;
  menu: IMenuItem[];
}
