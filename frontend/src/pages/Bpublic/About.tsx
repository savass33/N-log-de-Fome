import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Reutilizando o estilo

// (Você pode querer extrair Header/Footer para componentes /layout/public)
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

const PublicFooter: React.FC = () => (
  <footer className="public-footer">
    <p>© 2025 NLogDeFome. Todos os direitos reservados.</p>
  </footer>
);


export const About: React.FC = () => {
  return (
    <div className="public-page-container">
      <PublicHeader />
      
      <main className="public-content">
        <section className="content-section">
          <h2>Sobre a NLogDeFome</h2>
          <p>
            Nascemos da paixão por comida e tecnologia. Nossa missão é 
            conectar restaurantes incríveis a clientes famintos, 
            proporcionando uma experiência de delivery simples, rápida e confiável.
          </p>
          <p>
            Para restaurantes, oferecemos uma plataforma robusta para gerenciamento
            de cardápios, pedidos e visibilidade. Para clientes, oferecemos
            um mundo de sabores a um clique de distância.
          </p>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
};