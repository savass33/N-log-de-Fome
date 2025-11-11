import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import './Restaurant.css';

// Mock de dados
const mockSettings = {
  openingHours: '18:00 - 23:00',
  deliveryFee: 7.50,
  minOrderValue: 20.00
};

export const RestaurantSettings: React.FC = () => {
  const [openingHours, setOpeningHours] = useState(mockSettings.openingHours);
  const [deliveryFee, setDeliveryFee] = useState(mockSettings.deliveryFee.toString());

  const handleSave = () => {
    console.log('Salvando configurações:', { openingHours, deliveryFee });
    alert('Configurações salvas!');
  };

  return (
    <div className="restaurant-page-container">
      <h1>Configurações Operacionais</h1>

      <Card title="Horários e Taxas">
        <form className="restaurant-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="hours">Horário de Funcionamento (texto)</label>
            <Input 
              id="hours" 
              value={openingHours} 
              onChange={(e) => setOpeningHours(e.target.value)} 
              placeholder="Ex: Seg-Sex 18h-23h, Sáb-Dom 12h-00h"
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
          <Button onClick={handleSave} type="button">Salvar Configurações</Button>
        </form>
      </Card>
      
      <Card title="Integrações" className="restaurant-card-margin-top">
         <p>Conectar com sistema de pagamento (Stripe, etc.)</p>
         {/* Aqui poderia ter um botão "Conectar com Stripe" */}
      </Card>
    </div>
  );
};