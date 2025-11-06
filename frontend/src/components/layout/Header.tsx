import React from 'react';
import './Layout.css';

export const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-search">
        {/* <Input placeholder="Buscar..." /> */}
      </div>
      <div className="header-user">
        <span>Olá, Dono do Restaurante</span>
        {/* Avatar, etc. */}
      </div>
    </header>
  );
};