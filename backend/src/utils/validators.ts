import { ClientRepository } from "../repositories/ClientRepository";
import { RestaurantRepository } from "../repositories/RestaurantRepository";
import { AuthRepository } from "../repositories/AuthRepository"; // Usado para admin

const clientRepo = new ClientRepository();
const restRepo = new RestaurantRepository();
const authRepo = new AuthRepository();

export const Validators = {
  isValidEmail: (email: string): boolean => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  },

  isValidPhone: (phone: string): boolean => {
    const numbers = phone.replace(/\D/g, "");
    return numbers.length >= 10 && numbers.length <= 15;
  },

  isValidString: (text: any, minLength: number): boolean => {
    if (typeof text !== "string") return false;
    return text.trim().length >= minLength;
  },

  isEmailGloballyUnique: async (
    email: string,
    excludeId?: number,
    type?: "client" | "restaurant" | "admin"
  ): Promise<boolean> => {
    const client = await clientRepo.findByEmail(email);
    if (client && (type !== "client" || client.id_cliente !== excludeId))
      return false;
    const rest = await restRepo.findByEmailOrName(email, "");
    if (rest && (type !== "restaurant" || rest.id_restaurante !== excludeId))
      return false;

    const admin = await authRepo.findUserByEmail(email, "admin");
    if (admin && (type !== "admin" || admin.id_admin !== excludeId))
      return false;

    return true;
  },
};
