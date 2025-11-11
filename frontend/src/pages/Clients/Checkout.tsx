import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { formatCurrency } from '../../utils/formatCurrency';
import './Client.css';

// Mock de dados (viria de um Contexto de Carrinho)
const mockCart = [
  { id: 'm1', name: 'Pizza Margherita', price: 35.00, quantity: 1 },
  { id: 'm3', name: 'Refrigerante Lata', price: 10.25, quantity: 2 },
];
const deliveryFee = 7.50;

export const Checkout: React.FC = () => {
  const [address, setAddress] = useState('Rua das Flores, 123');
  const [payment, setPayment] = useState('credit-card');

  const subtotal = mockCart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = () => {
    alert('Pedido finalizado! (simulação)');
    // Aqui você chamaria o orderService para criar o pedido
  };

  return (
    <div className="client-page-container">
      <h1>Finalizar Pedido</h1>
      
      <div className="checkout-grid">
        <Card title="Endereço de Entrega e Pagamento">
          <form className="checkout-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label htmlFor="address">Endereço de Entrega</label>
              <Input 
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label>Forma de Pagamento</label>
              <select 
                value={payment} 
                onChange={(e) => setPayment(e.target.value)}
                className="input-field" // Reutilizando a classe do Input
              >
                <option value="credit-card">Cartão de Crédito</option>
                <option value="pix">PIX</option>
                <option value="cash">Dinheiro na Entrega</option>
              </select>
            </div>
            
            {payment === 'credit-card' && (
              <div className="form-group">
                <label>Dados do Cartão</label>
                <Input placeholder="Número do Cartão" />
                {/* ... outros campos do cartão ... */}
              </div>
            )}
          </form>
        </Card>

        <Card className="order-summary-card">
          <h3>Resumo do Pedido</h3>
          
          {mockCart.map(item => (
            <div key={item.id} className="summary-item">
              <span>{item.quantity}x {item.name}</span>
              <span>{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
          
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
            style={{ marginTop: '20px' }}
          >
            Finalizar Pedido
          </Button>
        </Card>
      </div>
    </div>
  );
};