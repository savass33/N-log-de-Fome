import React, { useEffect, useState } from "react";
import { type IRestaurant } from "../../interfaces/IRestaurant";
import { restaurantService } from "../../services/restaurantService";
import { Loader } from "../../components/common/Loader";
import { Button } from "../../components/common/Button";
import { ConfirmModal } from "../../components/modais/ConfirmModal";
import { RestaurantFormModal } from "../../components/modais/RestaurantFormModal";
import "./Admin.css";

export const RestaurantsList: React.FC = () => {
  const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [restoToDelete, setRestoToDelete] = useState<string | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [restoToEdit, setRestoToEdit] = useState<IRestaurant | null>(null);

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    setIsLoading(true);
    try {
      const data = await restaurantService.getRestaurants();
      setRestaurants(data);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar restaurantes. Verifique sua conexão.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setRestoToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (restoToDelete) {
      setIsLoading(true);
      try {
        await restaurantService.deleteRestaurant(restoToDelete);
        setRestaurants((prev) => prev.filter((r) => r.id !== restoToDelete));
        alert("Restaurante removido com sucesso!");
      } catch (error) {
        console.error(error);
        alert("Erro ao remover restaurante. Ele pode ter pedidos vinculados.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAddClick = () => {
    setRestoToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleEditClick = (resto: IRestaurant) => {
    setRestoToEdit(resto);
    setIsFormModalOpen(true);
  };

  const handleSaveRestaurant = async (formData: {
    id?: string;
    name: string;
    phone: string;
    cuisineType: string;
    email: string;
    address: string;
  }) => {
    setIsLoading(true);
    try {
      if (formData.id) {
        // EDITAR (UPDATE)
        await restaurantService.updateRestaurant(formData.id, {
          name: formData.name,
          phone: formData.phone,
          cuisineType: formData.cuisineType,
          address: formData.address,

          // CORREÇÃO CRUCIAL: Passar o email aqui também!
          email: formData.email,
        });
        alert("Restaurante atualizado!");
      } else {
        // CRIAR (CREATE)
        await restaurantService.createRestaurant({
          name: formData.name,
          phone: formData.phone,
          cuisineType: formData.cuisineType,
          email: formData.email,
          address: formData.address,
        });
        alert("Restaurante criado com sucesso!");
      }

      // Fecha o modal e recarrega
      setIsFormModalOpen(false);
      await loadRestaurants();
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.error || "Erro ao salvar restaurante.";
      alert(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="admin-page-container">
      <h1>Gerenciamento de Restaurantes</h1>

      {error && (
        <div
          className="error-message"
          style={{ color: "red", marginBottom: "20px" }}
        >
          {error}
        </div>
      )}

      <Button className="btn btn-add-new" onClick={handleAddClick}>
        Adicionar Novo Restaurante
      </Button>

      {restaurants.length === 0 && !error ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
          <p>Nenhum restaurante encontrado no banco de dados.</p>
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Telefone</th>
              <th>Endereço</th>
              <th>Tipo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((resto) => (
              <tr key={resto.id}>
                <td>{resto.name}</td>
                <td>{resto.cnpj}</td>
                <td>{resto.address}</td>
                <td>{resto.cuisineType}</td>
                <td className="admin-table-actions">
                  <Button onClick={() => handleEditClick(resto)}>Editar</Button>
                  <Button
                    onClick={() => handleDeleteClick(resto.id)}
                    style={{ backgroundColor: "#D32F2F" }}
                  >
                    Excluir
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Restaurante"
        message="Tem certeza? Isso apagará o restaurante e seu histórico de pedidos."
      />

      <RestaurantFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        restaurantToEdit={restoToEdit}
        onSave={handleSaveRestaurant}
      />
    </div>
  );
};
