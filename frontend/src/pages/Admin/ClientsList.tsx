import React, { useEffect, useState } from 'react';
import { type IClient } from '../../interfaces/IClient';
// import { clientService } from '../../services/clientService';
import { Loader } from '../../components/common/Loader';
import { Button } from '../../components/common/Button';
import './Admin.css'; // Reutilizando o CSS de admin

// Mock de dados (o service faria isso)
const mockClients: IClient[] = [
  { id: 'c1', name: 'Ana Silva', email: 'ana.silva@email.com', phone: '(11) 98888-1111', address: '', createdAt: '' },
  { id: 'c2', name: 'Bruno Costa', email: 'bruno.costa@email.com', phone: '(21) 97777-2222', address: '', createdAt: '' },
  { id: 'c3', name: 'Carla Dias', email: 'carla.dias@email.com', phone: '(31) 96666-3333', address: '', createdAt: '' },
  { id: 'c4', name: 'Daniel Moreira', email: 'daniel.m@email.com', phone: '(41) 95555-4444', address: '', createdAt: '' },
];

export const ClientsList: React.FC = () => {
  const [clients, setClients] = useState<IClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simula chamada de API
    setTimeout(() => {
      setClients(mockClients);
      setIsLoading(false);
    }, 400);
  }, []);

  if (isLoading) return <Loader />;

  return (
    <div className="admin-page-container">
      <h1>Gerenciamento de Clientes</h1>
      <p>Total de clientes na plataforma: {clients.length}</p>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(client => (
            <tr key={client.id}>
              <td>{client.name}</td>
              <td>{client.email}</td>
              <td>{client.phone}</td>
              <td className="admin-table-actions">
                <Button>Ver Pedidos</Button>
                <Button>Desativar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};