import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { type UserRole } from "../../routes/AppRoutes";
import { api } from "../../services/api";
import "./Auth.css";

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>("client");
  const [isLoading, setIsLoading] = useState(false);

  // Estados do Formulário
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [cuisineType, setCuisineType] = useState("");

  // --- UTILITÁRIOS DE VALIDAÇÃO E MÁSCARA ---

  // Máscara de Telefone: (11) 99999-9999
  const formatPhone = (value: string) => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, "");

    // Limita a 11 dígitos
    const limited = numbers.slice(0, 11);

    // Aplica a formatação visual
    return limited
      .replace(/^(\d{2})(\d)/g, "($1) $2") // Coloca parênteses no DDD
      .replace(/(\d)(\d{4})$/, "$1-$2"); // Coloca hífen
  };

  // Handler para o input de telefone
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  // Validação de Nome (Apenas letras e espaços, aceita acentos)
  const isValidName = (name: string) => {
    const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
    return regex.test(name);
  };

  // Validação de Email
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // --- LÓGICA DE SUBMISSÃO ---

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Sanitização
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phone.replace(/\D/g, ""); // Remove máscara para contar dígitos
    const cleanAddress = address.trim();
    const cleanCuisine = cuisineType.trim();

    // 2. Validações Rigorosas (Tratamento de Exceção)

    // Validação de Nome
    if (cleanName.length < 3) {
      return alert("O nome deve ter pelo menos 3 letras.");
    }
    if (!isValidName(cleanName)) {
      return alert("O nome não pode conter números ou símbolos especiais.");
    }

    // Validação de Email
    if (!isValidEmail(cleanEmail)) {
      return alert("Por favor, insira um e-mail válido.");
    }

    // Validação de Telefone (Mínimo 10 dígitos: DDD + 8 números)
    if (cleanPhone.length < 10) {
      return alert("O telefone deve conter DDD e o número completo.");
    }

    // Validações Específicas por Perfil
    if (
      (role === "client" || role === "restaurant") &&
      cleanAddress.length < 5
    ) {
      return alert("Por favor, insira um endereço completo e válido.");
    }

    if (role === "restaurant" && cleanCuisine.length < 3) {
      return alert(
        "Por favor, informe o tipo de cozinha (ex: Italiana, Lanches)."
      );
    }

    // 3. Envio Seguro
    setIsLoading(true);

    try {
      // Payload dinâmico baseado no papel
      if (role === "client") {
        await api.post("/clientes", {
          nome: cleanName,
          email: cleanEmail,
          telefone: phone, // Envia formatado ou cleanPhone, depende do gosto. Geralmente formatado ajuda na leitura.
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
      navigate("/"); // Redireciona para Login
    } catch (error) {
      console.error("Erro no cadastro:", error);
      // Tenta pegar mensagem de erro específica do backend se existir
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorMsg =
        (error as any).response?.data?.error ||
        "Erro ao realizar cadastro. Verifique se o e-mail já existe.";
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
              placeholder="Digite seu nome"
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
              onChange={handlePhoneChange} // Usa a máscara aqui
              className="auth-input"
              required
              placeholder="(XX) XXXXX-XXXX"
              maxLength={15} // Limite visual da máscara
            />
          </div>

          {/* O Endereço aparece para CLIENTE e RESTAURANTE */}
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
                placeholder="Rua, Número, Bairro"
                minLength={5}
              />
            </div>
          )}

          {/* Apenas Restaurante */}
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
