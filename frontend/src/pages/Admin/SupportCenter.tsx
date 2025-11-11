import React, { useState } from "react";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import "./Admin.css";

// Mock de dados para esta página
const mockTickets = [
  {
    id: "t1",
    user: "Restaurante Sushi Express",
    subject: "Não consigo atualizar meu cardápio",
    status: "open",
  },
  {
    id: "t2",
    user: "Cliente Ana Silva",
    subject: "Pedido 1001 veio errado",
    status: "open",
  },
  {
    id: "t3",
    user: "Cliente Bruno Costa",
    subject: "Problema no pagamento",
    status: "closed",
  },
];

export const SupportCenter: React.FC = () => {
  const [tickets, setTickets] = useState(mockTickets);

  const handleCloseTicket = (id: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "closed" } : t))
    );
  };

  const openTickets = tickets.filter((t) => t.status === "open");
  const closedTickets = tickets.filter((t) => t.status === "closed");

  return (
    <div className="admin-page-container">
      <h1>Central de Suporte</h1>
      <p>Acompanhe e resolva os chamados de clientes e restaurantes.</p>

      <h2>Chamados Abertos ({openTickets.length})</h2>
      <div className="support-tickets-list">
        {openTickets.map((ticket) => (
          <Card
            key={ticket.id}
            title={`Chamado #${ticket.id} - ${ticket.user}`}
          >
            <p>{ticket.subject}</p>
            <Button onClick={() => handleCloseTicket(ticket.id)}>
              Resolver Chamado
            </Button>
          </Card>
        ))}
      </div>

      <h2>Chamados Resolvidos ({closedTickets.length})</h2>
      <div className="support-tickets-list closed">
        {closedTickets.map((ticket) => (
          <Card
            key={ticket.id}
            title={`Chamado #${ticket.id} - ${ticket.user}`}
          >
            <p>{ticket.subject} (Resolvido)</p>
          </Card>
        ))}
      </div>
    </div>
  );
};
