export interface IUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: "admin" | "restaurant" | "client";
  // Dependendo do papel, pode ter IDs associados
  clientId?: string;
  restaurantId?: string;
}
