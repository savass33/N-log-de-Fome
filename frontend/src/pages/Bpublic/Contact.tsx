import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
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


export const Contact: React.FC = () => {
  return (
    <div className="public-page-container">
      <PublicHeader />
      
      <main className="public-content">
        <section className="content-section">
          <h2>Fale Conosco</h2>
          <p>
            Tem alguma dúvida, sugestão ou é um restaurante querendo ser parceiro?
            Preencha o formulário abaixo.
          </p>
          
          <form className="contact-form" style={{ maxWidth: '600px', margin: '30px auto' }}>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label>Seu Nome</label>
              <Input placeholder="Seu nome" />
            </div>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label>Seu Email</label>
              <Input type="email" placeholder="seu@email.com" />
            </div>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label>Mensagem</label>
              <textarea 
                placeholder="Sua mensagem..." 
                rows={6}
                style={{ width: '100%', padding: '10px', border: '1px solid var(--border-color)', borderRadius: '6px' }}
              />
            </div>
            <Button type="button">Enviar Mensagem</Button>
          </form>

        </section>
      </main>

      <PublicFooter />
    </div>
  );
};