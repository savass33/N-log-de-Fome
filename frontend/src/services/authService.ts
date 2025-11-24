import { api } from "./api";
import { type IUser } from "../interfaces/IUser";
import { type UserRole } from "../routes/AppRoutes";

export const authService = {
  loginByEmail: async (email: string, role: UserRole): Promise<IUser> => {
    const response = await api.post("/auth/login", { email, role });
    const dbUser = response.data;

    let user: IUser;

    if (role === "client") {
      user = {
        id: dbUser.id_cliente.toString(),
        name: dbUser.nome,
        email: dbUser.email,
        phone: dbUser.telefone || "",
        address: dbUser.endereco || "",
        role: "client",
        clientId: dbUser.id_cliente.toString(),
      };
    } else if (role === "restaurant") {
      user = {
        id: dbUser.id_restaurante.toString(),
        name: dbUser.nome,
        email: dbUser.email,
        phone: dbUser.telefone || "",
        address: dbUser.endereco || "Endereço não cadastrado",
        role: "restaurant",
        restaurantId: dbUser.id_restaurante.toString(),
      };
    } else {
      user = {
        id: dbUser.id_admin.toString(),
        name: dbUser.nome,
        email: dbUser.email,
        phone: dbUser.telefone || "",
        address: "Sede",
        role: "admin",
      };
    }
    return user;
  },
};
