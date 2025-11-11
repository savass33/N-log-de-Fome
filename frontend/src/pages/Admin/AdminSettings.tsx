import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import './Admin.css';

export const AdminSettings: React.FC = () => {
  const [platformFee, setPlatformFee] = useState('12.5');
  const [stripeKey, setStripeKey] = useState('pk_test_...');

  const handleSave = () => {
    // Em um app real, chama um service
    console.log('Salvando configurações:', { platformFee, stripeKey });
    alert('Configurações salvas!');
  };

  return (
    <div className="admin-page-container">
      <h1>Configurações da Plataforma</h1>

      <Card title="Configurações Financeiras">
        <form className="admin-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="platformFee">Taxa da Plataforma (%)</label>
            <Input 
              id="platformFee"
              type="number"
              value={platformFee}
              onChange={(e) => setPlatformFee(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="stripeKey">Chave API Stripe (Pública)</label>
            <Input 
              id="stripeKey"
              type="text"
              value={stripeKey}
              onChange={(e) => setStripeKey(e.target.value)}
            />
          </div>
          <Button onClick={handleSave} type="button">Salvar Alterações</Button>
        </form>
      </Card>
      
      <Card title="Outras Configurações" className="admin-card-margin-top">
        <p>Configurações de e-mail, termos de serviço, etc.</p>
      </Card>
    </div>
  );
};