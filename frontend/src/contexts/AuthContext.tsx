import React, { createContext, useState, type ReactNode, useMemo } from "react";
import { type IUser } from "../interfaces/IUser";
import { type UserRole } from "../routes/AppRoutes"; // Importa o tipo de perfil
import { useNavigate } from "react-router-dom";

interface IAuthContext {
  user: IUser | null;
  isLoading: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
}

// Criando o contexto com um valor padrão
export const AuthContext = createContext<IAuthContext | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Dados mockados para cada perfil
const MOCK_USERS: Record<UserRole, IUser> = {
  admin: {
    id: "admin-001",
    name: "Admin Supremo",
    email: "admin@nlogdefome.com",
    role: "admin",
  },
  restaurant: {
    id: "rest-001",
    name: "Restaurante da Boa",
    email: "restaurante@nlogdefome.com",
    role: "restaurant",
    restaurantId: "r1",
  },
  client: {
    id: "client-001",
    name: "Ana Silva",
    email: "ana@nlogdefome.com",
    role: "client",
    clientId: "c1",
  },
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const nav = useNavigate();
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Em app real, seria true ao verificar token

  // A função de login FAKE. Ela "logará" com o perfil escolhido.
  const login = (role: UserRole) => {
    setIsLoading(true);
    // Simula uma chamada de API
    setTimeout(() => {
      setUser(MOCK_USERS[role]);
      setIsLoading(false);
    }, 300); // 300ms de delay
  };

  // A função de logout
  const logout = () => {
    setUser(null);
    nav("/");
  };

  // Usamos 'useMemo' para otimizar e evitar re-renderizações desnecessárias
  const value = useMemo(
    () => ({
      user,
      isLoading,
      login,
      logout,
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
