import React, { useEffect, useState } from 'react';
import { type IClient } from '../../interfaces/IClient';
import { clientService } from '../../services/clientService'; // Importa o Serviço Real
import { Loader } from '../../components/common/Loader';
import { Button } from '../../components/common/Button';
import './Admin.css';

export const ClientsList: React.FC = () => {
  // Model local (State)
  const [clients, setClients] = useState<IClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Controller Logic: Busca dados ao iniciar
  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = () => {
    setIsLoading(true);
    clientService.getClients()
      .then(data => {
        setClients(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Erro ao conectar com o servidor (Porta 3001).');
        setIsLoading(false);
      });
  };

  if (isLoading) return <Loader />;

  return (
    <div className="admin-page-container">
      <h1>Gerenciamento de Clientes</h1>
      
      {error && (
        <div style={{ padding: '15px', backgroundColor: '#ffebee', color: '#c62828', marginBottom: '20px', borderRadius: '8px' }}>
          {error}
        </div>
      )}

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
          {clients.length === 0 && !error ? (
             <tr><td colSpan={4} style={{textAlign: 'center', padding: '20px', color: '#666'}}>Nenhum cliente encontrado no banco de dados.</td></tr>
          ) : (
            clients.map(client => (
              <tr key={client.id}>
                <td>{client.name}</td>
                <td>{client.email}</td>
                <td>{client.phone}</td>
                <td className="admin-table-actions">
                  <Button>Ver Pedidos</Button>
                  <Button style={{ backgroundColor: '#D32F2F' }}>Desativar</Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};