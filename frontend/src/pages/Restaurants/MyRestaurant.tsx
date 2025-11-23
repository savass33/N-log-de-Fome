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

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setAddress(user.address || "");
      setPhone(user.phone || "");
      // Como user.role é genérico, assumimos que o 'address' visual do authService
      // guardou o tipo de cozinha em algum lugar ou buscamos de novo.
      // Para simplificar, vamos buscar os dados frescos do banco:
      if (user.restaurantId) loadRestaurantData(user.restaurantId);
    }
  }, [user]);

  const loadRestaurantData = async (id: string) => {
    try {
      const data = await restaurantService.getRestaurantById(id);
      setName(data.name);
      setAddress(data.address);
      setPhone(data.cnpj); // Adapter mapeia fone -> cnpj
      setCuisine(data.cuisineType);
    } catch (error) {
      console.error("Erro ao carregar dados frescos:", error);
    }
  };

  const handleSaveChanges = async () => {
    try {
      if (!user?.restaurantId) return alert("Erro de identificação.");

      await restaurantService.updateRestaurant(user.restaurantId, {
        name,
        address,
        phone,
        cuisineType: cuisine,
      });

      // Atualiza sessão local
      updateUserSession({ name, address, phone });

      alert("Informações do restaurante atualizadas com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar informações.");
    }
  };

  return (
    <div className="restaurant-page-container">
      <h1>Meu Restaurante</h1>

      <Card>
        <div className="restaurant-profile-header">
          <h2>{name}</h2>
          <p>
            {cuisine} • {address}
          </p>
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
            />
          </div>
          <div className="form-group">
            <label htmlFor="cuisine">Tipo de Cozinha</label>
            <Input
              id="cuisine"
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Endereço</label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Telefone de Contato</label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <Button onClick={handleSaveChanges} type="button">
            Salvar Alterações
          </Button>
        </form>
      </Card>
    </div>
  );
};
