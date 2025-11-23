import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { type IMenuItem } from "../../interfaces/IMenuItem";
import { type IRestaurant } from "../../interfaces/IRestaurant";
import { restaurantService } from "../../services/restaurantService";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Loader } from "../../components/common/Loader";
import { formatCurrency } from "../../utils/formatCurrency";
import "./Client.css";

// Mock de Itens (Enquanto não temos tabela Cardápio no banco)
const MOCK_MENU: IMenuItem[] = [
  {
    id: "m1",
    name: "Prato da Casa",
    description: "Especialidade do chef",
    price: 35.0,
    category: "Pratos",
  },
  {
    id: "m2",
    name: "Bebida Lata",
    description: "Refri ou Suco",
    price: 6.0,
    category: "Bebidas",
  },
  {
    id: "m3",
    name: "Sobremesa",
    description: "Doce do dia",
    price: 12.0,
    category: "Sobremesas",
  },
];

export const RestaurantMenu: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState<{ item: IMenuItem; qty: number }[]>([]);

  useEffect(() => {
    if (id) loadRestaurant(id);
  }, [id]);

  const loadRestaurant = async (restId: string) => {
    try {
      const data = await restaurantService.getRestaurantById(restId);
      setRestaurant(data);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar restaurante.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = (item: IMenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        // Se já existe, incrementa quantidade
        return prev.map((i) =>
          i.item.id === item.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      // Se não, adiciona novo
      return [...prev, { item, qty: 1 }];
    });
  };

  const handleGoToCheckout = () => {
    // Navega para checkout passando o carrinho e o restaurante via STATE
    // Isso evita precisar de Contexto Global complexo para este exercício
    navigate("/client/checkout", {
      state: {
        cartItems: cart,
        restaurantId: restaurant?.id,
        restaurantName: restaurant?.name,
      },
    });
  };

  if (isLoading) return <Loader />;
  if (!restaurant) return <div>Restaurante não encontrado.</div>;

  return (
    <div className="client-page-container">
      <div className="menu-page-header">
        <img
          src={
            restaurant.imageUrl ||
            "https://placehold.co/400x200/e63946/white?text=Capa"
          }
          alt={restaurant.name}
          className="menu-restaurant-image"
        />
        <div className="menu-restaurant-info">
          <h1>{restaurant.name}</h1>
          <p>
            {restaurant.cuisineType} • {restaurant.address}
          </p>
          <p>Aberto das {restaurant.openingHours}</p>
        </div>
      </div>

      <h2>Cardápio</h2>

      <div className="menu-item-list">
        {/* Aqui usamos o MOCK_MENU, mas em um sistema real seria restaurant.menu */}
        {MOCK_MENU.map((item) => (
          <Card key={item.id} className="menu-item-card">
            <div className="menu-item-info">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <strong>{formatCurrency(item.price)}</strong>
            </div>
            <div className="menu-item-action">
              <Button onClick={() => handleAddItem(item)}>Adicionar</Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Botão flutuante do carrinho */}
      {cart.length > 0 && (
        <div className="cart-floating-action">
          <span>{cart.reduce((acc, i) => acc + i.qty, 0)} itens</span>
          <Button onClick={handleGoToCheckout}>Ver Carrinho & Pagar</Button>
        </div>
      )}
    </div>
  );
};
