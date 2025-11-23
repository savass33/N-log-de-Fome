import React, { useState, useEffect } from "react";
import { type IMenuItem } from "../../interfaces/IMenuItem";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Loader } from "../../components/common/Loader";
import { formatCurrency } from "../../utils/formatCurrency";
import "../Restaurants/Restaurant.css";
import { ConfirmModal } from "../../components/modais/ConfirmModal";
import { MenuFormModal } from "../../components/modais/MenuForm";
import { menuService } from "../../services/menuService";
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
    } else {
      setIsLoading(false); // Para não ficar carregando eternamente se não tiver ID
    }
  }, [user]);

  const loadMenu = async (restaurantId: string) => {
    setIsLoading(true);
    try {
      const data = await menuService.getMenuByRestaurant(restaurantId);
      setMenuItems(data);
    } catch (error) {
      console.error(error);
      // Não alertamos erro aqui para não assustar se for apenas vazio ou erro de rede momentâneo
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
    if (!user?.restaurantId)
      return alert("Erro de sessão. Faça login novamente.");

    setIsLoading(true);
    try {
      if (itemToEdit) {
        // Edição Real
        await menuService.updateItem(itemToEdit.id, item);
        alert("Item atualizado com sucesso!");
      } else {
        // Criação Real
        await menuService.createItem(user.restaurantId, item);
        alert("Item adicionado ao cardápio!");
      }
      // Recarrega do banco para garantir sincronia
      await loadMenu(user.restaurantId);
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar item. Verifique os dados e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete && user?.restaurantId) {
      setIsLoading(true);
      try {
        await menuService.deleteItem(itemToDelete);
        alert("Item removido com sucesso.");
        await loadMenu(user.restaurantId);
      } catch (error) {
        console.error(error);
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
          <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>
            <p>Seu cardápio está vazio no banco de dados.</p>
            <p>Clique em "Adicionar Novo Item" para começar a vender.</p>
          </div>
        </Card>
      ) : (
        <div className="menu-items-list">
          {menuItems.map((item) => (
            <Card key={item.id} className="menu-item-card">
              <div className="menu-item-details">
                <h3>{item.name}</h3>
                <p>{item.description || "Sem descrição"}</p>
                <span
                  style={{
                    fontSize: "0.8rem",
                    background: "#eee",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    display: "inline-block",
                    marginBottom: "5px",
                  }}
                >
                  {item.category}
                </span>
                <strong style={{ display: "block", fontSize: "1.1rem" }}>
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
