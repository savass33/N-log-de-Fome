export interface IUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: "admin" | "restaurant" | "client";
  clientId?: string;
  restaurantId?: string;
}
