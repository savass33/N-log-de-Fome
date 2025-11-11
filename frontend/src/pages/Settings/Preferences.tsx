import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import './Settings.css'; // Reutilizando o CSS de Configurações

export const Preferences: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotify, setEmailNotify] = useState(true);

  const handleSave = () => {
    console.log('Salvando preferências:', { darkMode, emailNotify });
    alert('Preferências salvas!');
  };

  return (
    <div className="settings-page-container">
      <h1>Preferências</h1>
      <Card title="Aparência e Notificações">
        <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group-toggle">
            <input 
              type="checkbox" 
              id="darkMode" 
              checked={darkMode} 
              onChange={() => setDarkMode(prev => !prev)} 
            />
            <label htmlFor="darkMode">Modo Escuro (Tema)</label>
          </div>
          <div className="form-group-toggle">
            <input 
              type="checkbox" 
              id="emailNotify" 
              checked={emailNotify} 
              onChange={() => setEmailNotify(prev => !prev)} 
            />
            <label htmlFor="emailNotify">Receber notificações por e-mail</label>
          </div>
          
          <Button onClick={handleSave} type="button">Salvar Preferências</Button>
        </form>
      </Card>
    </div>
  );
};