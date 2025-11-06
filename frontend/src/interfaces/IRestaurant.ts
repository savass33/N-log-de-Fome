import { type IMenuItem } from './IMenuItem';

export interface IRestaurant {
  id: string;
  name: string;
  cnpj: string;
  address: string;
  imageUrl: string;
  openingHours: string;
  responsibleName: string;
  menu: IMenuItem[];
}