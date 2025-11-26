import { Request, Response } from "express";
import { OrderRepository } from "../repositories/OrderRepository";

const repo = new OrderRepository();

export const OrderController = {
  async getAll(req: Request, res: Response) {
    try {
      const orders = await repo.findAll();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar pedidos." });
    }
  },

  async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido." });
    try {
      const order = await repo.findById(id);
      if (!order)
        return res.status(404).json({ error: "Pedido não encontrado." });
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Erro interno." });
    }
  },

  async getByRestaurant(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido." });
    try {
      const orders = await repo.findByRestaurant(id);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Erro interno." });
    }
  },

  async getByClient(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido." });
    try {
      const orders = await repo.findByClient(id);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Erro interno." });
    }
  },

  async create(req: Request, res: Response) {
    const { id_cliente_fk, id_restaurante_fk, itens } = req.body;

    // Validação Rigorosa do Payload
    if (!id_cliente_fk || isNaN(Number(id_cliente_fk)))
      return res.status(400).json({ error: "Cliente inválido." });
    if (!id_restaurante_fk || isNaN(Number(id_restaurante_fk)))
      return res.status(400).json({ error: "Restaurante inválido." });

    if (!itens || !Array.isArray(itens) || itens.length === 0) {
      return res
        .status(400)
        .json({ error: "O pedido deve conter pelo menos um item." });
    }

    // Validação Profunda dos Itens
    for (const item of itens) {
      if (!item.descricao || item.descricao.trim() === "")
        return res.status(400).json({ error: "Item com descrição inválida." });
      if (!item.quantidade || Number(item.quantidade) <= 0)
        return res
          .status(400)
          .json({
            error: `Quantidade inválida para o item: ${item.descricao}`,
          });
      if (item.preco === undefined || Number(item.preco) < 0)
        return res
          .status(400)
          .json({ error: `Preço inválido para o item: ${item.descricao}` });
    }

    try {
      const newOrder = await repo.create({
        clientId: id_cliente_fk,
        restaurantId: id_restaurante_fk,
        items: itens,
      });
      res.status(201).json(newOrder);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro crítico ao processar pedido." });
    }
  },

  async updateStatus(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { status_pedido } = req.body;

    if (isNaN(id)) return res.status(400).json({ error: "ID inválido." });

    const validStatus = [
      "Pendente",
      "Preparando",
      "Caminho",
      "Entregue",
      "Cancelado",
    ];

    // Mapeamento Case-Insensitive
    const statusMap: Record<string, string> = {
      pending: "Pendente",
      preparing: "Preparando",
      on_the_way: "Caminho",
      delivered: "Entregue",
      canceled: "Cancelado",
    };

    const key = String(status_pedido).toLowerCase().trim();
    const finalStatus = statusMap[key] || status_pedido;

    // Validação final de integridade do enum
    // (Aqui verificamos se a string final bate com o que o banco aceita, ignorando case sensitive no check)
    const isStatusValid = validStatus.some(
      (s) => s.toLowerCase() === String(finalStatus).toLowerCase()
    );

    if (!isStatusValid) {
      return res
        .status(400)
        .json({
          error: `Status inválido. Permitidos: ${validStatus.join(", ")}`,
        });
    }

    try {
      const updated = await repo.updateStatus(id, finalStatus);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar status." });
    }
  },
};
