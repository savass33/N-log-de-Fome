import React from "react";
import { useAuth } from "../../hooks/useAuth";
import "./Auth.css"; // Estilos da página

export const Login: React.FC = () => {
  const { login } = useAuth();

  return (
    <div className="auth-container">
      <div className="login-card">
        <h1 className="login-title">NLogDeFome</h1>
        <p className="login-subtitle">
          Selecione um perfil para testar a aplicação:
        </p>

        <div className="login-actions">
          <button className="btn btn-admin" onClick={() => login("admin")}>
            Logar como Administrador
          </button>

          <button
            className="btn btn-restaurant"
            onClick={() => login("restaurant")}
          >
            Logar como Restaurante
          </button>

          <button className="btn btn-client" onClick={() => login("client")}>
            Logar como Cliente
          </button>
        </div>
      </div>
    </div>
  );
};
