import React, { useState, useEffect } from "react";
import { Card } from "../../../components/common/Card";
import { Button } from "../../../components/common/Button";
import { Input } from "../../../components/common/Input"; // Use o componente correto
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
  const [cuisineType, setCuisineType] = useState(""); // Estado crucial para não perder dados

  // Sincroniza e busca dados frescos
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(formatPhone(user.phone || ""));
      setAddress(user.address || "");

      // Se for restaurante, busca o tipo de cozinha no banco para não sobrescrever com vazio
      if (user.role === "restaurant" && user.restaurantId) {
        loadRestaurantData(user.restaurantId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadRestaurantData = async (id: string) => {
    try {
      const data = await restaurantService.getRestaurantById(id);
      // Atualiza o estado local com o dado real do banco
      setCuisineType(data.cuisineType);
      // Opcional: Atualizar outros campos para garantir que estão frescos
      setName(data.name);
      setPhone(formatPhone(data.cnpj));
      setAddress(data.address);
    } catch (error) {
      console.error("Erro ao carregar dados extras:", error);
    }
  };

  const formatPhone = (val: string) => {
    if (!val) return "";
    const value = val.replace(/\D/g, "");
    const limited = value.slice(0, 11);
    return limited
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d)(\d{4})$/, "$1-$2");
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  const handleSaveProfile = async () => {
    if (!user || !user.id) return alert("Erro de sessão.");

    const cleanName = name.trim();
    const cleanPhone = phone.replace(/\D/g, "");

    if (cleanName.length < 3)
      return alert("O nome é obrigatório (mínimo 3 letras).");
    if (cleanPhone.length < 10) return alert("Telefone inválido.");

    setIsLoading(true);

    try {
      if (user.role === "client") {
        const clientId = user.clientId || user.id.replace(/\D/g, "");
        await clientService.updateClient(clientId, {
          name: cleanName,
          phone: phone, // Envia formatado
          address: address.trim(),
          email: user.email,
        });
      } else if (user.role === "restaurant") {
        const restId = user.restaurantId || user.id.replace(/\D/g, "");
        await restaurantService.updateRestaurant(restId, {
          name: cleanName,
          phone: phone,
          address: address.trim(),
          cuisineType: cuisineType, // Envia o valor recuperado (não apaga mais!)
          email: user.email,
        });
      } else if (user.role === "admin") {
        const adminId = user.id.replace(/\D/g, "");
        await api.put(`/admins/${adminId}`, {
          nome: cleanName,
          telefone: phone,
          email: user.email,
        });
      }

      updateUserSession({
        name: cleanName,
        phone: phone,
        address: address.trim(),
      });

      alert("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar alterações.");
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
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <Input
              id="email"
              value={user.email}
              readOnly
              disabled
              style={{ backgroundColor: "#f5f5f5", cursor: "not-allowed" }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Telefone</label>
            <Input
              id="phone"
              value={phone}
              onChange={handlePhoneChange} // Máscara aplicada
              disabled={isLoading}
              placeholder="(XX) XXXXX-XXXX"
              maxLength={15}
            />
          </div>

          {(user.role === "client" || user.role === "restaurant") && (
            <div className="form-group">
              <label htmlFor="address">Endereço</label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={isLoading}
              />
            </div>
          )}

          {/* Campo Oculto ou ReadOnly para CuisineType (se quiser mostrar) */}
          {user.role === "restaurant" && (
            <div className="form-group">
              <label htmlFor="cuisine">
                Tipo de Cozinha (Edite em "Meu Restaurante")
              </label>
              <Input
                id="cuisine"
                value={cuisineType}
                readOnly
                disabled
                style={{ backgroundColor: "#f9f9f9", color: "#666" }}
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
