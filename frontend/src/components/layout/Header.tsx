import React from "react";
import "./Layout.css";
import { useAuth } from "../../hooks/useAuth";

export const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-search">
      </div>
      <div className="header-user">
        <span>Olá, {user?.name || "Usuário"}</span>
        <button onClick={logout} className="btn-logout">
          Sair
        </button>
      </div>
    </header>
  );
};
