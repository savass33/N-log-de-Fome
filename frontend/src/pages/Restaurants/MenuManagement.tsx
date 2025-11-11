import React, { useState } from 'react';
import { type IMenuItem } from '../../interfaces/IMenuItem';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { formatCurrency } from '../../utils/formatCurrency';
import './Restaurant.css';

// Mock de dados
const mockMenu: IMenuItem[] = [
  { id: 'm1', name: 'Pizza Margherita', description: 'Molho, mussarela e manjericão', price: 35.00, imageUrl: 'https://via.placeholder.com/100', category: 'Pizzas' },
  { id: 'm2', name: 'Refrigerante Lata', description: 'Coca-Cola, Guaraná, etc.', price: 10.25, imageUrl: 'https://via.placeholder.com/100', category: 'Bebidas' },
  { id: 'm3', name: 'Hambúrguer Duplo', description: 'Dois hambúrgueres, queijo e bacon', price: 40.00, imageUrl: 'https://via.placeholder.com/100', category: 'Lanches' },
];

export const MenuManagement: React.FC = () => {
  const [menuItems, setMenuItems] = useState(mockMenu);
  const [isLoading, setIsLoading] = useState(false);

  // Lógica de CRUD (mockada)
  const handleAddItem = () => {
    // Em um app real, abriria um Modal (Modal.tsx)
    alert('Abriria um modal para adicionar novo item.');
  };

  const handleEditItem = (id: string) => {
    alert(`Abriria um modal para editar o item ${id}.`);
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este item?')) {
      setMenuItems(prev => prev.filter(item => item.id !== id));
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="restaurant-page-container">
      <div className="restaurant-page-header">
        <h1>Gerenciamento do Cardápio</h1>
        <Button onClick={handleAddItem} className="btn-add-new">
          Adicionar Novo Item
        </Button>
      </div>

      {menuItems.length === 0 ? (
        <Card>
          <p>Você ainda não tem itens no cardápio.</p>
        </Card>
      ) : (
        <div className="menu-items-list">
          {menuItems.map(item => (
            <Card key={item.id} className="menu-item-card">
              <img src={item.imageUrl} alt={item.name} className="menu-item-image" />
              <div className="menu-item-details">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <strong>{formatCurrency(item.price)}</strong>
              </div>
              <div className="menu-item-actions">
                <Button onClick={() => handleEditItem(item.id)}>Editar</Button>
                <Button onClick={() => handleDeleteItem(item.id)} className="btn-danger">
                  Remover
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};