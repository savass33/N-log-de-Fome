import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import './Restaurant.css';

// Mock de dados
const mockReviews = [
  { id: 'rev1', clientName: 'Ana Silva', rating: 5, comment: 'A pizza é maravilhosa! Chegou super rápido.', date: '2025-11-09' },
  { id: 'rev2', clientName: 'Bruno Costa', rating: 4, comment: 'O hambúrguer é bom, mas a batata podia ser mais crocante.', date: '2025-11-08' },
  { id: 'rev3', clientName: 'Carla Dias', rating: 5, comment: 'Melhor açaí da cidade!', date: '2025-11-07' },
];

// Componente simples para mostrar estrelas
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="star-rating">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={i < rating ? 'filled' : ''}>★</span>
      ))}
    </div>
  );
};

export const Reviews: React.FC = () => {
  const [reviews] = useState(mockReviews);
  
  const averageRating = (
    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
  ).toFixed(1);

  return (
    <div className="restaurant-page-container">
      <h1>Avaliações dos Clientes</h1>

      <Card title={`Média Geral: ${averageRating} ★`} className="reviews-summary-card">
        <p>{reviews.length} avaliações recebidas.</p>
      </Card>

      <div className="reviews-list">
        <h2>Todas as Avaliações</h2>
        {reviews.map(review => (
          <Card key={review.id} className="review-card">
            <div className="review-header">
              <strong>{review.clientName}</strong>
              <StarRating rating={review.rating} />
            </div>
            <p className="review-comment">"{review.comment}"</p>
            <span className="review-date">{new Date(review.date).toLocaleDateString('pt-BR')}</span>
          </Card>
        ))}
      </div>
    </div>
  );
};