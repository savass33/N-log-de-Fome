import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import './Home.css'; // Estilo público

// Header Público (para Landing, About, Contact)
const PublicHeader: React.FC = () => (
  <header className="public-header">
    <Link to="/" className="public-logo">NLogDeFome</Link>
    <nav className="public-nav">
      <Link to="/about">Sobre Nós</Link>
      <Link to="/contact">Contato</Link>
      <Link to="/auth/login" className="btn-login">Login</Link>
    </nav>
  </header>
);

// Footer Público
const PublicFooter: React.FC = () => (
  <footer className="public-footer">
    <p>© 2025 NLogDeFome. Todos os direitos reservados.</p>
  </footer>
);

export const Landing: React.FC = () => {
  return (
    <div className="public-page-container">
      <PublicHeader />
      
      <main className="public-content">
        <section className="hero-section">
          <div className="hero-content">
            <h1>Sua fome não espera.</h1>
            <p>Os melhores restaurantes da sua cidade, na velocidade da sua fome.</p>
            <Link to="/auth/login" className="btn-primary">Encontrar Restaurantes</Link>
          </div>
        </section>

        <section className="content-section">
          <h2>Como Funciona</h2>
          <p>
            1. Escolha um restaurante. 2. Monte seu pedido. 3. Receba em casa.
          </p>
          {/* [Image of simple order process icons] */}
        </section>
      </main>

      <PublicFooter />
    </div>
  );
};