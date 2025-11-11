import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import './Client.css';

export const ClientProfile: React.FC = () => {
  const { user } = useAuth(); // Pega o usuário logado

  // Mock de dados do perfil (em um app real, viria de um service)
  const [name, setName] = useState(user?.name || 'Ana Silva');
  const [phone, setPhone] = useState('(11) 98877-6655');
  const [address, setAddress] = useState('Rua das Flores, 123 - Centro');

  const handleSave = () => {
    alert('Perfil salvo com sucesso!');
    // Aqui chamaria o clientService.updateProfile
  };

  return (
    <div className="client-page-container">
      <h1>Meu Perfil</h1>
      
      <Card>
        <form className="profile-form profile-form-container" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="name">Nome Completo</label>
            <Input 
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <Input 
              id="email"
              value={user?.email || ''}
              readOnly
              disabled
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Telefone</label>
            <Input 
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Endereço Principal</label>
            <Input 
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <Button type="button" onClick={handleSave}>
            Salvar Alterações
          </Button>
        </form>
      </Card>
    </div>
  );
};