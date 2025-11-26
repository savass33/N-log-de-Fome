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
      else nav("/client/dashboard");
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

  const updateUserSession = (newData: Partial<IUser>) => {
    if (user) {
      const updatedUser = { ...user, ...newData };
      setUser(updatedUser);

      localStorage.setItem("nlog_user", JSON.stringify(updatedUser));
    }
  };

  const value = useMemo(
    () => ({
      user,
      isLoading,
      login,
      logout,
      updateUserSession,
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
