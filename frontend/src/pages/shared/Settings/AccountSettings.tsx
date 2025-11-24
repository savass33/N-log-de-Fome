import React, { useState, useEffect } from "react";
import { Card } from "../../../components/common/Card";
import { Button } from "../../../components/common/Button";
import { useAuth } from "../../../hooks/useAuth";
import { clientService } from "../../../services/clientService";
import { restaurantService } from "../../../services/restaurantService";
import { api } from "../../../services/api"; 
import "./Settings.css";

export const AccountSettings: React.FC = () => {
  const { user, updateUserSession } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(formatPhone(user.phone || ""));
      setAddress(user.address || "");
    }
  }, [user]);

  const formatPhone = (val: string) => {
    if (!val) return "";
    const value = val.replace(/\D/g, "");
    if (value.length > 11) return value.slice(0, 11);
    return value
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d)(\d{4})$/, "$1-$2");
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  const handleSaveProfile = async () => {
    if (!user || !user.id) return alert("Erro de sessão.");

    if (!name.trim()) return alert("O nome é obrigatório.");
    if (phone.replace(/\D/g, "").length < 10)
      return alert("Telefone inválido.");

    setIsLoading(true);

    try {
      if (user.role === "client") {
        const clientId = user.clientId || user.id.replace(/\D/g, "");
        await clientService.updateClient(clientId, {
          name,
          phone,
          address,
          email: user.email,
        });
      } else if (user.role === "restaurant") {
        const restId = user.restaurantId || user.id.replace(/\D/g, "");
        await restaurantService.updateRestaurant(restId, {
          name,
          phone,
          address,
        });
      } else if (user.role === "admin") {
        const adminId = user.id.replace(/\D/g, "");
        await api.put(`/admins/${adminId}`, {
          nome: name,
          telefone: phone,
          email: user.email,
        });
      }

      updateUserSession({ name, phone, address });

      alert("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar alterações. Verifique o console.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return <div>Carregando...</div>;

  return (
    <div className="settings-page-container">
      <h1>Configurações da Conta</h1>

      <Card title="Meu Perfil">
        <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="name">
              Nome {user.role === "restaurant" ? "do Restaurante" : "Completo"}
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="auth-input"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email (Fixo)</label>
            <input
              id="email"
              type="text"
              value={user.email}
              readOnly
              disabled
              style={{ backgroundColor: "#f5f5f5", cursor: "not-allowed" }}
              className="auth-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Telefone</label>
            <input
              id="phone"
              value={phone}
              onChange={handlePhoneChange}
              disabled={isLoading}
              placeholder="(XX) XXXXX-XXXX"
              className="auth-input"
            />
          </div>

          {(user.role === "client" || user.role === "restaurant") && (
            <div className="form-group">
              <label htmlFor="address">Endereço</label>
              <input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={isLoading}
                className="auth-input"
              />
            </div>
          )}

          <Button
            onClick={handleSaveProfile}
            type="button"
            disabled={isLoading}
          >
            {isLoading ? "Salvando..." : "Salvar Perfil"}
          </Button>
        </form>
      </Card>

      <div
        className="info-box"
        style={{
          marginTop: "20px",
          padding: "15px",
          backgroundColor: "#e3f2fd",
          borderRadius: "8px",
          color: "#0d47a1",
          fontSize: "0.9rem",
        }}
      >
        <strong>Nota de Segurança:</strong> O login é realizado via e-mail. Para
        alterar seu e-mail de acesso, entre em contato com o suporte.
      </div>
    </div>
  );
};
