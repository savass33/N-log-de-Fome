import React, { useEffect, useState } from "react";
import { type IClient } from "../../interfaces/IClient";
import { clientService } from "../../services/clientService";
import { Loader } from "../../components/common/Loader";
import { Button } from "../../components/common/Button";
import { ConfirmModal } from "../../components/modais/ConfirmModal";
import "./Admin.css";

export const ClientsList: React.FC = () => {
  const [clients, setClients] = useState<IClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = () => {
    setIsLoading(true);
    clientService
      .getClients()
      .then((data) => {
        setClients(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Erro ao conectar com o servidor.");
        setIsLoading(false);
      });
  };

  const handleDeleteClick = (id: string) => {
    setClientToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (clientToDelete) {
      try {
        await clientService.deleteClient(clientToDelete);
        setClients((prev) => prev.filter((c) => c.id !== clientToDelete));
        alert("Cliente removido com sucesso.");
      } catch (error) {
        console.error(error);
        alert("Erro ao remover cliente.");
      }
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="admin-page-container">
      <h1>Gerenciamento de Clientes</h1>

      {error && (
        <div
          style={{
            padding: "15px",
            backgroundColor: "#ffebee",
            color: "#c62828",
            marginBottom: "20px",
            borderRadius: "8px",
          }}
        >
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
            <tr>
              <td
                colSpan={4}
                style={{ textAlign: "center", padding: "20px", color: "#666" }}
              >
                Nenhum cliente encontrado.
              </td>
            </tr>
          ) : (
            clients.map((client) => (
              <tr key={client.id}>
                <td>{client.name}</td>
                <td>{client.email}</td>
                <td>{client.phone}</td>
                <td className="admin-table-actions">
                  <Button
                    onClick={() => handleDeleteClick(client.id)}
                    style={{ backgroundColor: "#D32F2F" }}
                  >
                    Excluir
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Cliente"
        message="Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita."
      />
    </div>
  );
};
