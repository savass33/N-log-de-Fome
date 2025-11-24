import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import { type UserRole } from "../../routes/AppRoutes";
import "./Auth.css";

export const Login: React.FC = () => {
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("client");

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      return alert("Por favor, digite seu e-mail.");
    }

    if (!isValidEmail(cleanEmail)) {
      return alert(
        "Por favor, digite um e-mail válido (ex: nome@dominio.com)."
      );
    }

    await login(cleanEmail, role);
  };

  return (
    <div className="auth-container">
      <div className="login-card">
        <h1 className="login-title">NLogDeFome</h1>
        <p className="login-subtitle">Bem-vindo de volta! Acesse sua conta.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Selecione seu perfil:</label>
            <div className="role-selector">
              <label
                className={`role-option ${role === "client" ? "active" : ""}`}
              >
                <input
                  type="radio"
                  name="role"
                  checked={role === "client"}
                  onChange={() => setRole("client")}
                />{" "}
                Cliente
              </label>
              <label
                className={`role-option ${
                  role === "restaurant" ? "active" : ""
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  checked={role === "restaurant"}
                  onChange={() => setRole("restaurant")}
                />{" "}
                Restaurante
              </label>
              <label
                className={`role-option ${role === "admin" ? "active" : ""}`}
              >
                <input
                  type="radio"
                  name="role"
                  checked={role === "admin"}
                  onChange={() => setRole("admin")}
                />{" "}
                Admin
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              placeholder="exemplo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              required
            />
          </div>

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Não tem uma conta? <Link to="/register">Cadastre-se aqui</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
