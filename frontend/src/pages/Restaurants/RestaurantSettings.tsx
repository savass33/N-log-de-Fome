import React, { useState } from "react";
import { Card } from "../../components/common/Card";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import "./Restaurant.css";

export const RestaurantSettings: React.FC = () => {
  // Dados locais apenas, pois não temos tabela 'config_restaurante'
  const [openingHours, setOpeningHours] = useState("18:00 - 23:00");
  const [deliveryFee, setDeliveryFee] = useState("7.50");

  const handleSave = () => {
    // Aqui salvaríamos em uma tabela específica se ela existisse
    alert("Configurações salvas localmente (Simulação)!");
  };

  return (
    <div className="restaurant-page-container">
      <h1>Configurações Operacionais</h1>

      <Card title="Horários e Taxas">
        <form className="restaurant-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="hours">Horário de Funcionamento</label>
            <Input
              id="hours"
              value={openingHours}
              onChange={(e) => setOpeningHours(e.target.value)}
              placeholder="Ex: Seg-Sex 18h-23h"
            />
          </div>
          <div className="form-group">
            <label htmlFor="deliveryFee">Taxa de Entrega (R$)</label>
            <Input
              id="deliveryFee"
              type="number"
              value={deliveryFee}
              onChange={(e) => setDeliveryFee(e.target.value)}
            />
          </div>
          <Button onClick={handleSave} type="button">
            Salvar Configurações
          </Button>
        </form>
      </Card>

      <Card title="Integrações" className="restaurant-card-margin-top">
        <p>Conectar com meios de pagamento (Em breve)</p>
      </Card>
    </div>
  );
};
