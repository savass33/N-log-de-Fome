import React, { useState, useEffect } from "react";
import { Card } from "../../components/common/Card";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { useAuth } from "../../hooks/useAuth";
import { restaurantService } from "../../services/restaurantService";
import "./Restaurant.css";

export const MyRestaurant: React.FC = () => {
  const { user, updateUserSession } = useAuth();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setAddress(user.address || "");
      if (user.phone) setPhone(formatPhone(user.phone));
      if (user.restaurantId) loadRestaurantData(user.restaurantId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

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

  const handleCuisineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^[A-Za-zÀ-ÖØ-öø-ÿ\s]*$/.test(val)) {
      setCuisine(val);
    }
  };

  const loadRestaurantData = async (id: string) => {
    try {
      const data = await restaurantService.getRestaurantById(id);
      setName(data.name);
      setAddress(data.address);
      setPhone(formatPhone(data.cnpj));
      setCuisine(data.cuisineType);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  const handleSaveChanges = async () => {
    if (!user?.restaurantId) return alert("Erro de sessão.");

    const cleanName = name.trim();
    const cleanAddress = address.trim();
    const cleanPhone = phone.replace(/\D/g, "");
    const cleanCuisine = cuisine.trim();

    if (cleanName.length < 3) return alert("Nome inválido.");
    if (cleanAddress.length < 5) return alert("Endereço incompleto.");
    if (cleanAddress.length > 50) return alert("Endereço é muito grande.");
    if (cleanPhone.length < 10) return alert("Telefone inválido.");

    if (cleanCuisine.length < 3) {
      return alert("Tipo de cozinha inválido (mínimo 3 letras).");
    }

    setIsLoading(true);
    try {
      await restaurantService.updateRestaurant(user.restaurantId, {
        name: cleanName,
        address: cleanAddress,
        phone: phone,
        cuisineType: cleanCuisine,
        email: user.email, // CORREÇÃO: Envia o email atual para manter integridade
      });

      updateUserSession({
        name: cleanName,
        address: cleanAddress,
        phone: phone,
      });

      alert("Informações atualizadas com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar informações.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="restaurant-page-container">
      <h1>Meu Restaurante</h1>
      {/* ... (Resto do JSX permanece igual) ... */}
      <Card>
        <div className="restaurant-profile-header">
          <div style={{ textAlign: "left" }}>
            <h2 style={{ margin: 0 }}>{name || "Carregando..."}</h2>
            <p style={{ color: "#666", margin: "5px 0" }}>{cuisine}</p>
            <p style={{ fontSize: "0.9rem" }}>{address}</p>
          </div>
        </div>
      </Card>

      <Card
        title="Editar Informações Públicas"
        className="restaurant-card-margin-top"
      >
        <form className="restaurant-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="name">Nome do Restaurante</label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="cuisine">Tipo de Cozinha</label>
            <Input
              id="cuisine"
              value={cuisine}
              onChange={handleCuisineChange}
              disabled={isLoading}
              placeholder="Ex: Italiana (Apenas letras)"
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Endereço</label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Telefone de Contato</label>
            <Input
              id="phone"
              value={phone}
              onChange={handlePhoneChange}
              disabled={isLoading}
              placeholder="(XX) XXXXX-XXXX"
              maxLength={15}
            />
          </div>
          <Button
            onClick={handleSaveChanges}
            type="button"
            disabled={isLoading}
          >
            {isLoading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </form>
      </Card>
    </div>
  );
};
