import React from 'react';
import { Link } from 'react-router-dom';
import './Errors.css';

export const NotFound: React.FC = () => {
  return (
    <div className="error-page-container">
      <h1>404</h1>
      <h2>Página Não Encontrada</h2>
      <p>Desculpe, a página que você está procurando não existe ou foi movida.</p>
      <Link to="/" className="btn">
        Voltar para a Home
      </Link>
    </div>
  );
};