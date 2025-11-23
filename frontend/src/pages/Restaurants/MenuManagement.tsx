import React, { useState, useEffect } from "react";
import { type IMenuItem } from "../../interfaces/IMenuItem";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Loader } from "../../components/common/Loader";
import { formatCurrency } from "../../utils/formatCurrency";
import "../Restaurants/Restaurant.css";
import { ConfirmModal } from "../../components/modais/ConfirmModal";
import { MenuFormModal } from "../../components/modais/MenuForm";
import { menuService } from "../../services/menuService"; // Service novo
import { useAuth } from "../../hooks/useAuth";

export const MenuManagement: React.FC = () => {
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados dos Modais
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<IMenuItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (user?.restaurantId) {
      loadMenu(user.restaurantId);
    }
  }, [user]);

  const loadMenu = async (restaurantId: string) => {
    setIsLoading(true);
    try {
      const data = await menuService.getMenuByRestaurant(restaurantId);
      setMenuItems(data);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar cardápio.");
    } finally {
      setIsLoading(false);
    }
  };

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
    if (!user?.restaurantId) return;

    setIsLoading(true);
    try {
      if (itemToEdit) {
        // Edição
        await menuService.updateItem(itemToEdit.id, item);
        alert("Item atualizado!");
      } else {
        // Criação
        await menuService.createItem(user.restaurantId, item);
        alert("Item criado!");
      }
      // Recarrega a lista do banco
      await loadMenu(user.restaurantId);
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar item.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete && user?.restaurantId) {
      setIsLoading(true);
      try {
        await menuService.deleteItem(itemToDelete);
        alert("Item removido.");
        await loadMenu(user.restaurantId);
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
            Seu cardápio está vazio no banco de dados.
          </p>
        </Card>
      ) : (
        <div className="menu-items-list">
          {menuItems.map((item) => (
            <Card key={item.id} className="menu-item-card">
              <div className="menu-item-details">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <span
                  style={{
                    fontSize: "0.8rem",
                    background: "#eee",
                    padding: "2px 6px",
                    borderRadius: "4px",
                  }}
                >
                  {item.category}
                </span>
                <strong style={{ display: "block", marginTop: "8px" }}>
                  {formatCurrency(item.price)}
                </strong>
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
