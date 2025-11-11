import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Link } from 'react-router-dom';
import './Client.css';

// Mock de dados
const mockRestaurants = [
  { id: 'r1', name: 'Pizza da Boa', category: 'Pizzaria', deliveryTime: '30-45 min', imageUrl: 'https://placehold.co/400x200/D93025/white?text=Pizza' },
  { id: 'r2', name: 'Sushi Express', category: 'Japonesa', deliveryTime: '45-60 min', imageUrl: 'https://placehold.co/400x200/333333/white?text=Sushi' },
  { id: 'r3', name: 'Burger do Zé', category: 'Hamburgueria', deliveryTime: '20-40 min', imageUrl: 'https://placehold.co/400x200/F2994A/white?text=Burger' },
];

export const RestaurantsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRestaurants = mockRestaurants.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="client-page-container">
      <h1>Restaurantes</h1>
      <Input 
        placeholder="Buscar restaurante pelo nome..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '24px', width: '100%' }}
      />
      
      <div className="restaurant-list-grid">
        {filteredRestaurants.map(resto => (
          <Link 
            to={`/app/client/restaurants/${resto.id}/menu`} 
            key={resto.id} 
            className="restaurant-card-link"
          >
            <Card>
              <img 
                src={resto.imageUrl} 
                alt={resto.name} 
                className="restaurant-card-image"
              />
              <div className="restaurant-card-content">
                <h3>{resto.name}</h3>
                <p>{resto.category} • {resto.deliveryTime}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};