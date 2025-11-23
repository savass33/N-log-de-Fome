import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "../../components/common/Card";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { formatCurrency } from "../../utils/formatCurrency";
import { orderService } from "../../services/orderService";
import { useAuth } from "../../hooks/useAuth";
import { type IMenuItem } from "../../interfaces/IMenuItem";
import "./Client.css";

interface CartItem {
  item: IMenuItem;
  qty: number;
}

export const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Recupera dados passados pela navegação
  const cartItems = (location.state?.cartItems as CartItem[]) || [];
  const restaurantId = location.state?.restaurantId;
  const restaurantName = location.state?.restaurantName;

  const [address, setAddress] = useState(user?.address || "");
  const [payment, setPayment] = useState("credit-card");
  const [isLoading, setIsLoading] = useState(false);

  const subtotal = cartItems.reduce(
    (acc, row) => acc + row.item.price * row.qty,
    0
  );
  const deliveryFee = 5.0; // Fixo por enquanto
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    if (!cartItems.length) return alert("Carrinho vazio!");
    if (!user?.clientId) return alert("Erro de usuário. Faça login novamente.");
    if (!restaurantId) return alert("Erro de restaurante.");

    setIsLoading(true);
    try {
      // Monta o payload que o backend (Index.ts) espera
      await orderService.createOrder({
        clientId: Number(user.clientId),
        restaurantId: Number(restaurantId),
        items: cartItems.map((i) => ({
          descricao: i.item.name, // Backend usa 'descricao'
          quantidade: i.qty,
          preco: i.item.price,
        })),
      });

      alert("Pedido realizado com sucesso!");
      navigate("/client/orders"); // Vai para o histórico
    } catch (error) {
      console.error(error);
      alert("Erro ao finalizar pedido. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!cartItems.length) {
    return (
      <div className="client-page-container">
        <h1>Seu carrinho está vazio</h1>
        <Button onClick={() => navigate("/client/restaurants")}>
          Voltar para Restaurantes
        </Button>
      </div>
    );
  }

  return (
    <div className="client-page-container">
      <h1>Finalizar Pedido - {restaurantName}</h1>

      <div className="checkout-grid">
        <Card title="Endereço e Pagamento">
          <form className="checkout-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label htmlFor="address">Endereço de Entrega</label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Forma de Pagamento</label>
              <select
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
                className="input-field"
              >
                <option value="credit-card">Cartão de Crédito</option>
                <option value="pix">PIX</option>
                <option value="cash">Dinheiro</option>
              </select>
            </div>
          </form>
        </Card>

        <Card className="order-summary-card">
          <h3>Resumo</h3>
          {cartItems.map((row) => (
            <div key={row.item.id} className="summary-item">
              <span>
                {row.qty}x {row.item.name}
              </span>
              <span>{formatCurrency(row.item.price * row.qty)}</span>
            </div>
          ))}

          <hr />
          <div className="summary-item">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="summary-item">
            <span>Entrega</span>
            <span>{formatCurrency(deliveryFee)}</span>
          </div>

          <div className="summary-total">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>

          <Button
            onClick={handlePlaceOrder}
            className="checkout-button"
            style={{ marginTop: "20px" }}
            disabled={isLoading}
          >
            {isLoading ? "Processando..." : "Confirmar Pedido"}
          </Button>
        </Card>
      </div>
    </div>
  );
};
