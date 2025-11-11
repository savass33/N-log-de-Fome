import React from 'react';
import { Link } from 'react-router-dom';
import './Errors.css'; // Reutilizando o CSS de Erro

export const AccessDenied: React.FC = () => {
  return (
    <div className="error-page-container">
      <h1>Acesso Negado</h1>
      <h2>Você não tem permissão para ver esta página.</h2>
      <p>O seu perfil de usuário não autoriza o acesso a este recurso.</p>
      <Link to="/" className="btn">
        Voltar para a Home
      </Link>
    </div>
  );
};