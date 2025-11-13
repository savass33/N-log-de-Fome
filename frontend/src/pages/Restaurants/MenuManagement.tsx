import React, { useState } from "react";
import { type IMenuItem } from "../../interfaces/IMenuItem";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Loader } from "../../components/common/Loader";
import { formatCurrency } from "../../utils/formatCurrency";
import "../Restaurants/Restaurant.css"; // Reutiliza o CSS existente

// --- Importações dos Modais ---
import { ConfirmModal } from "../../components/modais/ConfirmModal";
import { MenuFormModal } from "../../components/modais/MenuForm";
// ---------------------------------

// Mock de dados (como no arquivo anterior)
const mockMenu: IMenuItem[] = [
  {
    id: "m1",
    name: "Pizza Margherita",
    description: "Molho, mussarela e manjericão",
    price: 35.0,
    imageUrl: "https://placehold.co/100/D93025/white?text=Pizza",
    category: "Pizzas",
  },
  {
    id: "m2",
    name: "Refrigerante Lata",
    description: "Coca-Cola, Guaraná, etc.",
    price: 10.25,
    imageUrl: "https://placehold.co/100/F2994A/white?text=Bebida",
    category: "Bebidas",
  },
  {
    id: "m3",
    name: "Hambúrguer Duplo",
    description: "Dois hambúrgueres, queijo e bacon",
    price: 40.0,
    imageUrl: "https://placehold.co/100/2E7D32/white?text=Lanche",
    category: "Lanches",
  },
];

export const MenuManagement: React.FC = () => {
  const [menuItems, setMenuItems] = useState(mockMenu);
  const [isLoading, setIsLoading] = useState(false);

  // --- Estados de controle dos Modais ---
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const [itemToEdit, setItemToEdit] = useState<IMenuItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  // ----------------------------------------

  // --- Funções de Abertura dos Modais ---
  const handleOpenAddItem = () => {
    setItemToEdit(null); // Limpa o item (modo "Adicionar")
    setIsFormModalOpen(true);
  };

  const handleOpenEditItem = (item: IMenuItem) => {
    setItemToEdit(item); // Define o item (modo "Editar")
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteConfirm = (id: string) => {
    setItemToDelete(id); // Define o ID do item a ser deletado
    setIsConfirmModalOpen(true);
  };

  // --- Funções de Ação dos Modais ---
  const handleSaveItem = (item: IMenuItem) => {
    if (itemToEdit) {
      // Lógica de Edição
      setMenuItems((prev) => prev.map((m) => (m.id === item.id ? item : m)));
    } else {
      // Lógica de Adição
      setMenuItems((prev) => [item, ...prev]);
    }
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setMenuItems((prev) => prev.filter((item) => item.id !== itemToDelete));
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
          <p>Você ainda não tem itens no cardápio.</p>
        </Card>
      ) : (
        <div className="menu-items-list">
          {menuItems.map((item) => (
            <Card key={item.id} className="menu-item-card">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="menu-item-image"
              />
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
                >
                  Remover
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* --- Renderização dos Modais --- */}
      {/* (Eles ficam aqui, "escutando" os estados) */}

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
        message={`Tem certeza que deseja remover este item do cardápio? Esta ação não pode ser desfeita.`}
      />
    </div>
  );
};
