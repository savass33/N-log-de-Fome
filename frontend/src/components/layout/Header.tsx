import React from "react";
import "./Layout.css";
import { useAuth } from "../../hooks/useAuth"; // 1. Importar o hook

export const Header: React.FC = () => {
  // 2. Chamar o hook para pegar o usuário e a função logout
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-search">
        {/* Espaço para busca (pode adicionar um Input aqui) */}
      </div>
      <div className="header-user">
        {/* 3. Usar o nome do usuário do contexto */}
        <span>Olá, {user?.name || "Usuário"}</span>

        {/* 4. O seu botão de Sair */}
        <button onClick={logout} className="btn-logout">
          Sair
        </button>
      </div>
    </header>
  );
};
