import React, { useEffect, useState } from "react";
import { type IRestaurant } from "../../interfaces/IRestaurant";
import { restaurantService } from "../../services/restaurantService";
import { Loader } from "../../components/common/Loader";
import { Button } from "../../components/common/Button";
import { ConfirmModal } from "../../components/modais/ConfirmModal";
import { RestaurantFormModal } from "../../components/modais/RestaurantFormModal"; // Importe o novo modal
import "./Admin.css";

export const RestaurantsList: React.FC = () => {
  const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para Exclusão
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [restoToDelete, setRestoToDelete] = useState<string | null>(null);

  // Estado para Criação/Edição
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [restoToEdit, setRestoToEdit] = useState<IRestaurant | null>(null);

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = () => {
    setIsLoading(true);
    restaurantService
      .getRestaurants()
      .then((data) => {
        setRestaurants(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Erro ao carregar restaurantes. O backend está ativo?");
        setIsLoading(false);
      });
  };

  // --- Handlers de Exclusão ---
  const handleDeleteClick = (id: string) => {
    setRestoToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (restoToDelete) {
      try {
        await restaurantService.deleteRestaurant(restoToDelete);
        // Atualiza a lista local (Optimistic update ou reload)
        setRestaurants((prev) => prev.filter((r) => r.id !== restoToDelete));
        alert("Restaurante removido com sucesso!");
      } catch (error) {
        console.error(error);
        alert("Erro ao remover restaurante.");
      }
    }
  };

  // --- Handlers de Criação/Edição ---

  // Abrir modal para criar NOVO
  const handleAddClick = () => {
    setRestoToEdit(null); // Null indica criação
    setIsFormModalOpen(true);
  };

  // Abrir modal para EDITAR existente
  const handleEditClick = (resto: IRestaurant) => {
    setRestoToEdit(resto); // Objeto indica edição
    setIsFormModalOpen(true);
  };

  // Salvar (Create ou Update)
  const handleSaveRestaurant = async (formData: {
    id?: string;
    name: string;
    phone: string;
    cuisineType: string;
    email: string;
    address: string;
  }) => {
    try {
      if (formData.id) {
        // EDITAR (UPDATE)
        await restaurantService.updateRestaurant(formData.id, {
          name: formData.name,
          phone: formData.phone,
          cuisineType: formData.cuisineType,
          address: formData.address,
          // Se seu service suportar update de email, passe aqui também
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
        alert("Restaurante criado!");
      }
      // Recarrega a lista para mostrar os dados novos
      loadRestaurants();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar restaurante.");
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
                {/* Nota: No service mapeamos Telefone -> CNPJ na interface, ajuste conforme necessidade visual */}
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

      {/* Modal de Exclusão */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Restaurante"
        message="Tem certeza? Isso apagará o restaurante e todo o seu histórico."
      />

      {/* Modal de Formulário (Criação/Edição) */}
      <RestaurantFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        restaurantToEdit={restoToEdit}
        onSave={handleSaveRestaurant}
      />
    </div>
  );
};
