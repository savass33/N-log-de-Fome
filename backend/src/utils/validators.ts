import { ClientRepository } from "../repositories/ClientRepository";
import { RestaurantRepository } from "../repositories/RestaurantRepository";
import { AuthRepository } from "../repositories/AuthRepository"; // Usado para admin

const clientRepo = new ClientRepository();
const restRepo = new RestaurantRepository();
const authRepo = new AuthRepository();

export const Validators = {
  // Regex Padrão Ouro para E-mail
  isValidEmail: (email: string): boolean => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  },

  // Telefone deve ter entre 10 e 15 dígitos numéricos
  isValidPhone: (phone: string): boolean => {
    const numbers = phone.replace(/\D/g, "");
    return numbers.length >= 10 && numbers.length <= 15;
  },

  // Verifica se o texto tem tamanho mínimo e não é só espaço
  isValidString: (text: any, minLength: number): boolean => {
    if (typeof text !== "string") return false;
    return text.trim().length >= minLength;
  },

  // VALIDAÇÃO GLOBAL DE E-MAIL (A que resolve seu problema)
  // Verifica se o email existe em QUALQUER tabela do sistema
  isEmailGloballyUnique: async (
    email: string,
    excludeId?: number,
    type?: "client" | "restaurant" | "admin"
  ): Promise<boolean> => {
    // 1. Verifica em Clientes
    const client = await clientRepo.findByEmail(email);
    if (client && (type !== "client" || client.id_cliente !== excludeId))
      return false;

    // 2. Verifica em Restaurantes (precisa criar findByEmail no repo se não tiver, ou usar findByEmailOrName)
    // Vou assumir que o findByEmailOrName busca pelo email
    const rest = await restRepo.findByEmailOrName(email, "");
    if (rest && (type !== "restaurant" || rest.id_restaurante !== excludeId))
      return false;

    // 3. Verifica em Admins
    const admin = await authRepo.findUserByEmail(email, "admin");
    if (admin && (type !== "admin" || admin.id_admin !== excludeId))
      return false;

    return true; // Se passou por tudo, é único
  },
};
