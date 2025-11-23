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
  const deliveryFee = 5.0;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    // 1. Validações Robustas
    if (!cartItems.length) return alert("Seu carrinho está vazio.");

    if (!user?.clientId) {
      return alert(
        "Erro crítico: Usuário não identificado. Tente fazer login novamente."
      );
    }

    if (!restaurantId) {
      return alert(
        "Erro crítico: Restaurante não identificado. Volte ao cardápio."
      );
    }

    const cleanAddress = address.trim();
    if (cleanAddress.length < 5) {
      return alert("Por favor, informe um endereço de entrega válido.");
    }

    // 2. Envio Seguro
    setIsLoading(true);
    try {
      await orderService.createOrder({
        clientId: Number(user.clientId),
        restaurantId: Number(restaurantId),
        items: cartItems.map((i) => ({
          descricao: i.item.name,
          quantidade: i.qty,
          preco: i.item.price,
        })),
      });

      alert("Pedido realizado com sucesso! Acompanhe no histórico.");
      navigate("/client/orders");
    } catch (error) {
      console.error(error);
      alert(
        "Não foi possível finalizar o pedido. Tente novamente em instantes."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!cartItems.length) {
    return (
      <div className="client-page-container">
        <Card>
          <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>Seu carrinho está vazio 🛒</h2>
            <p>Adicione itens deliciosos antes de finalizar.</p>
            <Button
              onClick={() => navigate("/client/restaurants")}
              style={{ marginTop: "15px" }}
            >
              Ver Restaurantes
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="client-page-container">
      <h1>Finalizar Pedido</h1>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        Restaurante: <strong>{restaurantName}</strong>
      </p>

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
                placeholder="Rua, Número - Bairro"
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
                <option value="cash">Dinheiro na Entrega</option>
              </select>
            </div>
          </form>
        </Card>

        <Card className="order-summary-card">
          <h3>Resumo do Pedido</h3>
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
            <span>Taxa de Entrega</span>
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
            {isLoading ? "Processando..." : `Pagar ${formatCurrency(total)}`}
          </Button>
        </Card>
      </div>
    </div>
  );
};
