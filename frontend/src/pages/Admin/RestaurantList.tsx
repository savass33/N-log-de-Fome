import React, { useEffect, useState } from "react";
import { type IRestaurant } from "../../interfaces/IRestaurant";
import { restaurantService } from "../../services/restaurantService";
import { Loader } from "../../components/common/Loader";
import { Button } from "../../components/common/Button";
import "./Admin.css";

// --- ATENÇÃO AQUI: O nome deve ser RestaurantsList (com S) ---
export const RestaurantsList: React.FC = () => {
  const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = () => {
    setIsLoading(true);
    restaurantService.getRestaurants()
      .then(data => {
        setRestaurants(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Erro ao carregar restaurantes. O backend está ativo?");
        setIsLoading(false);
      });
  };

  if (isLoading) return <Loader />;

  return (
    <div className="admin-page-container">
      <h1>Gerenciamento de Restaurantes</h1>
      
      {error && <div className="error-message" style={{color: 'red', marginBottom: '20px'}}>{error}</div>}

      <Button className="btn">Adicionar Novo Restaurante</Button>

      {restaurants.length === 0 && !error ? (
         <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <p>Nenhum restaurante encontrado no banco de dados.</p>
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Telefone (CNPJ)</th>
              <th>Tipo Cozinha</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((resto) => (
              <tr key={resto.id}>
                <td>{resto.name}</td>
                <td>{resto.cnpj}</td>
                <td>{resto.address}</td>
                <td className="admin-table-actions">
                  <Button>Ver Cardápio</Button>
                  <Button>Editar</Button>
                  <Button style={{ backgroundColor: '#D32F2F' }}>Desativar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};