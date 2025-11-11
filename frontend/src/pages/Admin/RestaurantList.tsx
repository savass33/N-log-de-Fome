import React, { useEffect, useState } from "react";
import { type IRestaurant } from "../../interfaces/IRestaurant";
// import { restaurantService } from '../../services/restaurantService';
import { Loader } from "../../components/common/Loader";
import { Button } from "../../components/common/Button";
import "./Admin.css"; // CSS comum para páginas de admin

// Mock de dados (o service faria isso)
const mockRestaurants: IRestaurant[] = [
  {
    id: "r1",
    name: "Pizza da Boa",
    cnpj: "11.222.333/0001-44",
    address: "Rua A, 123",
    imageUrl: "",
    openingHours: "",
    responsibleName: "João",
    menu: [],
  },
  {
    id: "r2",
    name: "Sushi Express",
    cnpj: "44.555.666/0001-77",
    address: "Av. B, 456",
    imageUrl: "",
    openingHours: "",
    responsibleName: "Maria",
    menu: [],
  },
  {
    id: "r3",
    name: "Padaria Pão Quente",
    cnpj: "77.888.999/0001-00",
    address: "Praça C, 789",
    imageUrl: "",
    openingHours: "",
    responsibleName: "Carlos",
    menu: [],
  },
];

export const RestaurantsList: React.FC = () => {
  const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simula chamada de API
    setTimeout(() => {
      setRestaurants(mockRestaurants);
      setIsLoading(false);
    }, 500);
  }, []);

  if (isLoading) return <Loader />;

  return (
    <div className="admin-page-container">
      <h1>Gerenciamento de Restaurantes</h1>
      <Button className="btn-add-new">Adicionar Novo Restaurante</Button>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>CNPJ</th>
            <th>Endereço</th>
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
                <Button>Desativar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
