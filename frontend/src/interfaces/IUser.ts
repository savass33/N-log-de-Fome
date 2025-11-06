export interface IUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'restaurant' | 'client';
  // Dependendo do papel, pode ter IDs associados
  clientId?: string;
  restaurantId?: string;
}