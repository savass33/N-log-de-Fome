import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { type IMenuItem } from "../../interfaces/IMenuItem";
import { type IRestaurant } from "../../interfaces/IRestaurant";
import { restaurantService } from "../../services/restaurantService";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Loader } from "../../components/common/Loader";
import { formatCurrency } from "../../utils/formatCurrency"; // Importante
import "./Client.css";
import { menuService } from "../../services/menuService";

export const RestaurantMenu: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState<{ item: IMenuItem; qty: number }[]>([]);
  const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);

  useEffect(() => {
    if (id) {
      loadRestaurant(id);
      loadMenu(id);
    }
  }, [id]);

  const loadMenu = async (restId: string) => {
    try {
      const data = await menuService.getMenuByRestaurant(restId);
      setMenuItems(data);
    } catch (err) {
      console.error(err);
    }
  };

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
        return prev.map((i) =>
          i.item.id === item.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { item, qty: 1 }];
    });
  };

  const handleGoToCheckout = () => {
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
        {menuItems.length === 0 ? (
          <div style={{textAlign: 'center', color: '#666', padding: '20px'}}>
             Este restaurante ainda não cadastrou itens no cardápio.
          </div>
        ) : (
          menuItems.map((item) => (
            // CORREÇÃO: Removi 'children={undefined}' e coloquei o conteúdo dentro
            <Card key={item.id} className="menu-item-card">
              <div className="menu-item-info">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <span className="item-category-badge">{item.category}</span>
                <strong style={{display: 'block', marginTop: '8px'}}>
                    {formatCurrency(item.price)}
                </strong>
              </div>
              <div className="menu-item-action">
                <Button onClick={() => handleAddItem(item)}>Adicionar</Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Botão flutuante do carrinho */}
      {cart.length > 0 && (
        <div className="cart-floating-action">
          <span>{cart.reduce((acc, i) => acc + i.qty, 0)} itens no carrinho</span>
          <Button onClick={handleGoToCheckout} style={{backgroundColor: '#fff', color: '#e63946'}}>
             Ir para Pagamento
          </Button>
        </div>
      )}
    </div>
  );
};