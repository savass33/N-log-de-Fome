import React, {
  createContext,
  useState,
  type ReactNode,
  useMemo,
  useEffect,
} from "react";
import { type IUser } from "../interfaces/IUser";
import { type UserRole } from "../routes/AppRoutes";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

interface IAuthContext {
  user: IUser | null;
  isLoading: boolean;
  login: (email: string, role: UserRole) => Promise<void>;
  logout: () => void;
  // NOVA FUNÇÃO: Permite atualizar os dados do usuário sem deslogar
  updateUserSession: (newData: Partial<IUser>) => void;
}

export const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const nav = useNavigate();
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("nlog_user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login = async (email: string, role: UserRole) => {
    setIsLoading(true);
    try {
      const userDb = await authService.loginByEmail(email, role);
      setUser(userDb);
      localStorage.setItem("nlog_user", JSON.stringify(userDb));

      if (role === "admin") nav("/admin/restaurants");
      else if (role === "restaurant") nav("/restaurant/orders");
      else nav("/client/restaurants");
    } catch (error) {
      console.error(error);
      alert("Falha no login.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("nlog_user");
    nav("/");
  };

  // --- NOVA FUNÇÃO DE ATUALIZAÇÃO ---
  const updateUserSession = (newData: Partial<IUser>) => {
    if (user) {
      // 1. Cria o novo objeto misturando o antigo com os dados novos
      const updatedUser = { ...user, ...newData };

      // 2. Atualiza o Estado do React (reflete na hora na tela)
      setUser(updatedUser);

      // 3. Atualiza o LocalStorage (reflete ao dar F5)
      localStorage.setItem("nlog_user", JSON.stringify(updatedUser));
    }
  };

  const value = useMemo(
    () => ({
      user,
      isLoading,
      login,
      logout,
      updateUserSession, // Não esqueça de exportar aqui
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
