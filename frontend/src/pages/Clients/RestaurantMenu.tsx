import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { type IMenuItem } from '../../interfaces/IMenuItem';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { formatCurrency } from '../../utils/formatCurrency';
import './Client.css';

// Mock de dados (um service buscaria isso pelo ID do restaurante)
const mockRestaurant = {
  id: 'r1',
  name: 'Pizza da Boa',
  category: 'Pizzaria',
  deliveryTime: '30-45 min',
  imageUrl: 'https://placehold.co/400x200/D93025/white?text=Pizza'
};

const mockMenu: IMenuItem[] = [
  { id: 'm1', name: 'Pizza Margherita', description: 'Molho, mussarela e manjericão', price: 35.00, imageUrl: '', category: 'Pizzas' },
  { id: 'm2', name: 'Pizza Calabresa', description: 'Molho, mussarela e calabresa', price: 38.00, imageUrl: '', category: 'Pizzas' },
  { id: 'm3', name: 'Refrigerante Lata', description: 'Coca-Cola, Guaraná, etc.', price: 10.25, imageUrl: '', category: 'Bebidas' },
  { id: 'm4', name: 'Água Mineral', description: '500ml sem gás', price: 5.00, imageUrl: '', category: 'Bebidas' },
];

export const RestaurantMenu: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // Em um app real, o 'cart' (carrinho) estaria em um Contexto
  const [cart, setCart] = useState<IMenuItem[]>([]);

  const handleAddItem = (item: IMenuItem) => {
    setCart(prevCart => [...prevCart, item]);
    // Idealmente, isso abriria um modal para quantidade e observações
    alert(`${item.name} adicionado ao carrinho!`);
  };

  return (
    <div className="client-page-container">
      <div className="menu-page-header">
        <img src={mockRestaurant.imageUrl} alt={mockRestaurant.name} className="menu-restaurant-image" />
        <div className="menu-restaurant-info">
          <h1>{mockRestaurant.name}</h1>
          <p>{mockRestaurant.category}</p>
          <p>{mockRestaurant.deliveryTime}</p>
        </div>
      </div>

      <h2>Cardápio</h2>
      
      <div className="menu-item-list">
        {mockMenu.map(item => (
          <Card key={item.id} className="menu-item-card">
            <div className="menu-item-info">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <strong>{formatCurrency(item.price)}</strong>
            </div>
            <div className="menu-item-action">
              <Button onClick={() => handleAddItem(item)}>Adicionar</Button>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Botão flutuante do carrinho (simplificado) */}
      {cart.length > 0 && (
        <Button 
          onClick={() => alert('Indo para o Checkout...')}
          style={{ position: 'fixed', bottom: '30px', right: '30px', padding: '15px 25px', fontSize: '1.1rem' }}
        >
          Ver Carrinho ({cart.length})
        </Button>
      )}
    </div>
  );
};