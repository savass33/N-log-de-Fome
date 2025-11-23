import React, { useState } from "react";
import { type IMenuItem } from "../../interfaces/IMenuItem";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Loader } from "../../components/common/Loader";
import { formatCurrency } from "../../utils/formatCurrency";
import "../Restaurants/Restaurant.css";
import { ConfirmModal } from "../../components/modais/ConfirmModal";
import { MenuFormModal } from "../../components/modais/MenuForm";

export const MenuManagement: React.FC = () => {
  const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // --- Modais ---
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<IMenuItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // --- Handlers ---
  const handleOpenAddItem = () => {
    setItemToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditItem = (item: IMenuItem) => {
    setItemToEdit(item);
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteConfirm = (id: string) => {
    setItemToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const handleSaveItem = async (item: IMenuItem) => {
    setIsLoading(true);
    try {
      // SIMULAÇÃO DE BACKEND (Substituir por api.post/put quando tiver tabela)
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (itemToEdit) {
        setMenuItems((prev) => prev.map((m) => (m.id === item.id ? item : m)));
        alert("Item atualizado com sucesso!");
      } else {
        // Gera ID único simulado
        const newItem = { ...item, id: Date.now().toString() };
        setMenuItems((prev) => [newItem, ...prev]);
        alert("Item adicionado ao cardápio!");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar item.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      setIsLoading(true);
      try {
        // SIMULAÇÃO DE DELETE
        await new Promise((resolve) => setTimeout(resolve, 500));
        setMenuItems((prev) => prev.filter((item) => item.id !== itemToDelete));
        alert("Item removido.");
      } catch (error) {
        alert("Erro ao remover item.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="restaurant-page-container">
      <div className="restaurant-page-header">
        <h1>Gerenciamento do Cardápio</h1>
        <Button onClick={handleOpenAddItem} className="btn">
          Adicionar Novo Item
        </Button>
      </div>

      {menuItems.length === 0 ? (
        <Card>
          <p style={{ textAlign: "center", color: "#666" }}>
            Seu cardápio está vazio. Adicione itens para começar a vender.
          </p>
        </Card>
      ) : (
        <div className="menu-items-list">
          {menuItems.map((item) => (
            <Card key={item.id} className="menu-item-card">
              <div className="menu-item-details">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <strong>{formatCurrency(item.price)}</strong>
              </div>
              <div className="menu-item-actions">
                <Button onClick={() => handleOpenEditItem(item)}>Editar</Button>
                <Button
                  onClick={() => handleOpenDeleteConfirm(item.id)}
                  className="btn"
                  style={{ backgroundColor: "#d32f2f" }}
                >
                  Remover
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <MenuFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveItem}
        itemToEdit={itemToEdit}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja remover este item do cardápio?`}
      />
    </div>
  );
};
