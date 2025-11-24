import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { type IMenuItem } from "../../interfaces/IMenuItem";
import { type IRestaurant } from "../../interfaces/IRestaurant";
import { restaurantService } from "../../services/restaurantService";
import { menuService } from "../../services/menuService";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Loader } from "../../components/common/Loader";
import { formatCurrency } from "../../utils/formatCurrency";
import "./Client.css";

interface CartItem {
  item: IMenuItem;
  qty: number;
}

export const RestaurantMenu: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);
  const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    if (id) {
      loadData(id);
    }
  }, [id]);

  const loadData = async (restId: string) => {
    setIsLoading(true);
    try {
      const [restData, menuData] = await Promise.all([
        restaurantService.getRestaurantById(restId),
        menuService.getMenuByRestaurant(restId),
      ]);
      setRestaurant(restData);
      setMenuItems(menuData);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar dados do restaurante.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleIncrement = (item: IMenuItem) => {
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

  const handleDecrement = (itemId: string) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.item.id === itemId);
      if (existing?.qty === 1) {
        return prev.filter((i) => i.item.id !== itemId);
      }
      return prev.map((i) =>
        i.item.id === itemId ? { ...i, qty: i.qty - 1 } : i
      );
    });
  };

  const getQty = (itemId: string) => {
    return cart.find((i) => i.item.id === itemId)?.qty || 0;
  };

  const cartTotal = cart.reduce(
    (acc, curr) => acc + curr.item.price * curr.qty,
    0
  );

  const cartCount = cart.reduce((acc, curr) => acc + curr.qty, 0);

  const handleGoToCheckout = () => {
    if (cart.length === 0) return;
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
          <p style={{ color: "#28a745", fontWeight: "600" }}>
            Aberto • Fecha às {restaurant.openingHours.split("-")[1]}
          </p>
        </div>
      </div>

      <div className="menu-page-layout">
        <div className="menu-section">
          <h2 style={{ marginBottom: "20px" }}>Cardápio</h2>

          <div className="menu-item-list">
            {menuItems.length === 0 ? (
              <p style={{ color: "#777" }}>
                Nenhum item disponível no momento.
              </p>
            ) : (
              menuItems.map((item) => {
                const qty = getQty(item.id);

                return (
                  <Card key={item.id} className="menu-item-card">
                    <div className="menu-item-content">
                      <h3>{item.name}</h3>
                      <p
                        style={{
                          fontSize: "0.9rem",
                          color: "#666",
                          marginBottom: "8px",
                        }}
                      >
                        {item.description}
                      </p>
                      <span className="menu-item-price">
                        {formatCurrency(item.price)}
                      </span>

                      {qty === 0 ? (
                        <Button
                          onClick={() => handleIncrement(item)}
                          style={{
                            marginTop: "10px",
                            fontSize: "0.85rem",
                            padding: "8px 16px",
                          }}
                        >
                          Adicionar
                        </Button>
                      ) : (
                        <div className="quantity-control">
                          <button
                            className="btn-qty"
                            onClick={() => handleDecrement(item.id)}
                          >
                            -
                          </button>
                          <span className="qty-value">{qty}</span>
                          <button
                            className="btn-qty"
                            onClick={() => handleIncrement(item)}
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </div>

        <div className="cart-sidebar">
          <h3 style={{ color: "#e63946" }}>Seu Pedido</h3>

          {cart.length === 0 ? (
            <p
              style={{ color: "#999", textAlign: "center", padding: "20px 0" }}
            >
              Seu carrinho está vazio. Adicione itens do menu.
            </p>
          ) : (
            <>
              <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                {cart.map((row) => (
                  <div key={row.item.id} className="cart-item-row">
                    <span>
                      {row.qty}x {row.item.name}
                    </span>
                    <span>{formatCurrency(row.item.price * row.qty)}</span>
                  </div>
                ))}
              </div>

              <div className="cart-total-row">
                <span>Total</span>
                <span>{formatCurrency(cartTotal)}</span>
              </div>

              <Button
                onClick={handleGoToCheckout}
                style={{ width: "100%", marginTop: "20px" }}
              >
                Continuar
              </Button>
            </>
          )}
        </div>
      </div>

      {cartCount > 0 && (
        <div className="cart-floating-action">
          <div>
            <span
              style={{ display: "block", fontSize: "0.9rem", color: "#666" }}
            >
              Total
            </span>
            <strong style={{ fontSize: "1.2rem", color: "#333" }}>
              {formatCurrency(cartTotal)}
            </strong>
          </div>
          <Button onClick={handleGoToCheckout}>
            Ver Carrinho ({cartCount})
          </Button>
        </div>
      )}
    </div>
  );
};
