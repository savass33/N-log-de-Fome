import React, { useState } from 'react';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import './Settings.css'; // CSS novo para as páginas de Configurações

// Mock de dados (viria do useAuth())
const currentUser = {
  name: 'Administrador',
  email: 'admin@nlogdefome.com',
  phone: '(00) 12345-6789'
};

export const AccountSettings: React.FC = () => {
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSaveProfile = () => {
    console.log('Salvando perfil:', { name, phone });
    alert('Perfil salvo!');
  };

  const handleChangePassword = () => {
    console.log('Alterando senha...');
    alert('Senha alterada!');
  };

  return (
    <div className="settings-page-container">
      <h1>Configurações da Conta</h1>

      <Card title="Meu Perfil">
        <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="name">Nome</label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <Input id="email" value={currentUser.email} readOnly disabled />
          </div>
           <div className="form-group">
            <label htmlFor="phone">Telefone</label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <Button onClick={handleSaveProfile} type="button">Salvar Perfil</Button>
        </form>
      </Card>

      <Card title="Alterar Senha" className="card-margin-top">
         <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
           <div className="form-group">
              <label htmlFor="password">Senha Atual</label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
           </div>
           <div className="form-group">
              <label htmlFor="newPassword">Nova Senha</label>
              <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
           </div>
           <Button onClick={handleChangePassword} type="button">Alterar Senha</Button>
         </form>
      </Card>
    </div>
  );
};