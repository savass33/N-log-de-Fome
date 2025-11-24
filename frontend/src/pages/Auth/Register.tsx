import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { type UserRole } from "../../routes/AppRoutes";
import { api } from "../../services/api";
import "./Auth.css";

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>("client");
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [cuisineType, setCuisineType] = useState("");

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    const limited = numbers.slice(0, 11);
    return limited
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d)(\d{4})$/, "$1-$2");
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  const isValidName = (name: string) => {
    const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
    return regex.test(name);
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidAddress = (addr: string) => {
    const hasLetters = /[a-zA-ZÀ-ÖØ-öø-ÿ]/.test(addr);
    const hasNumbers = /\d/.test(addr);
    return hasLetters && hasNumbers;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phone.replace(/\D/g, "");
    const cleanAddress = address.trim();
    const cleanCuisine = cuisineType.trim();

    if (cleanName.length < 3)
      return alert("O nome deve ter pelo menos 3 letras.");

    if (!isValidName(cleanName))
      return alert("O nome não pode conter números ou símbolos.");

    if (!isValidEmail(cleanEmail))
      return alert("Por favor, insira um e-mail válido.");

    if (cleanPhone.length < 10)
      return alert("O telefone deve conter DDD e o número completo.");

    if (role === "client" || role === "restaurant") {
      if (cleanAddress.length < 5) {
        return alert("Endereço muito curto. Informe Rua, Número e Bairro.");
      }
      if (!isValidAddress(cleanAddress)) {
        return alert(
          "O endereço deve conter o nome da rua e o número (Ex: Rua das Flores, 123)."
        );
      }
    }

    if (role === "restaurant" && cleanCuisine.length < 3) {
      return alert(
        "Por favor, informe o tipo de cozinha (ex: Italiana, Lanches)."
      );
    }

    setIsLoading(true);

    try {
      if (role === "client") {
        await api.post("/clientes", {
          nome: cleanName,
          email: cleanEmail,
          telefone: phone,
          endereco: cleanAddress,
        });
      } else if (role === "restaurant") {
        await api.post("/restaurantes", {
          nome: cleanName,
          email: cleanEmail,
          telefone: phone,
          tipo_cozinha: cleanCuisine,
          endereco: cleanAddress,
        });
      } else if (role === "admin") {
        await api.post("/admins", {
          nome: cleanName,
          email: cleanEmail,
          telefone: phone,
        });
      }

      alert("Cadastro realizado com sucesso! Faça login para continuar.");
      navigate("/");
    } catch (error: any) {
      console.error("Erro no cadastro:", error);
      const errorMsg =
        error.response?.data?.error ||
        "Erro ao realizar cadastro. Verifique seus dados.";
      alert(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Crie sua Conta</h1>
        <p className="auth-subtitle">Junte-se ao NLogDeFome</p>

        <form onSubmit={handleRegister} className="auth-form">
          <div className="form-group">
            <label>Quero me cadastrar como:</label>
            <div className="role-selector">
              {" "}
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="auth-input"
              >
                <option value="client">Cliente</option>
                <option value="restaurant">Restaurante</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>
              Nome Completo {role === "restaurant" && "(do Restaurante)"}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="auth-input"
              required
              placeholder="Digite apenas letras"
              minLength={3}
            />
          </div>

          <div className="form-group">
            <label>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              required
              placeholder="seu@email.com"
            />
          </div>

          <div className="form-group">
            <label>Telefone</label>
            <input
              type="text"
              value={phone}
              onChange={handlePhoneChange}
              className="auth-input"
              required
              placeholder="(XX) XXXXX-XXXX"
              maxLength={15}
            />
          </div>

          {(role === "client" || role === "restaurant") && (
            <div className="form-group">
              <label>
                Endereço{" "}
                {role === "restaurant" ? "do Restaurante" : "de Entrega"}
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="auth-input"
                required
                placeholder="Rua, Número e Bairro"
                minLength={5}
              />
              <small style={{ color: "#666", fontSize: "0.8rem" }}>
                Ex: Av Paulista, 1500
              </small>
            </div>
          )}

          {role === "restaurant" && (
            <div className="form-group">
              <label>Tipo de Cozinha</label>
              <input
                type="text"
                value={cuisineType}
                onChange={(e) => setCuisineType(e.target.value)}
                className="auth-input"
                required
                placeholder="Ex: Italiana, Japonesa..."
              />
            </div>
          )}

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? "Cadastrando..." : "Finalizar Cadastro"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Já tem uma conta? <Link to="/login">Faça Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
