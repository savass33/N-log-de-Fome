import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import './Restaurant.css'; // Novo CSS dedicado

// Mock de dados do restaurante (viria do useAuth ou um service)
const mockRestaurant = {
  name: 'Pizza da Boa',
  cnpj: '11.222.333/0001-44',
  address: 'Rua A, 123, Centro',
  responsibleName: 'João Silva',
  phone: '(11) 98888-1111',
  imageUrl: 'https://via.placeholder.com/300x200?text=Logo+do+Restaurante'
};

export const MyRestaurant: React.FC = () => {
  const [name, setName] = useState(mockRestaurant.name);
  const [address, setAddress] = useState(mockRestaurant.address);
  const [phone, setPhone] = useState(mockRestaurant.phone);

  const handleSaveChanges = () => {
    console.log('Salvando dados:', { name, address, phone });
    alert('Informações salvas!');
  };

  return (
    <div className="restaurant-page-container">
      <h1>Meu Restaurante</h1>

      <Card>
        <div className="restaurant-profile-header">
          <img 
            src={mockRestaurant.imageUrl} 
            alt="Logo do Restaurante" 
            className="restaurant-logo" 
          />
          <h2>{mockRestaurant.name}</h2>
          <p>CNPJ: {mockRestaurant.cnpj}</p>
        </div>
      </Card>

      <Card title="Editar Informações Públicas" className="restaurant-card-margin-top">
        <form className="restaurant-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="name">Nome do Restaurante</label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="address">Endereço</label>
            <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Telefone de Contato</label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <Button onClick={handleSaveChanges} type="button">Salvar Alterações</Button>
        </form>
      </Card>
    </div>
  );
};