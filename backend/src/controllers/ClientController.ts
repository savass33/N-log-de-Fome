import { Request, Response } from "express";
import { ClientRepository } from "../repositories/ClientRepository";
import { OrderRepository } from "../repositories/OrderRepository";
import { Validators } from "../utils/validators";

const clientRepo = new ClientRepository();
const orderRepo = new OrderRepository();

export const ClientController = {
  async getAll(req: Request, res: Response) {
    try {
      const clients = await clientRepo.findAll();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ error: "Erro interno ao buscar clientes." });
    }
  },

  async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id))
      return res.status(400).json({ error: "ID do cliente inválido." });

    try {
      const client = await clientRepo.findById(id);
      if (!client)
        return res.status(404).json({ error: "Cliente não encontrado." });
      res.json(client);
    } catch (error) {
      res.status(500).json({ error: "Erro interno." });
    }
  },

  async create(req: Request, res: Response) {
    const { nome, telefone, endereco, email } = req.body;

    if (!Validators.isValidString(nome, 3))
      return res
        .status(400)
        .json({ error: "Nome deve ter no mínimo 3 caracteres." });
    if (!Validators.isValidString(endereco, 5))
      return res
        .status(400)
        .json({ error: "Endereço inválido ou muito curto." });
    if (!Validators.isValidPhone(telefone))
      return res
        .status(400)
        .json({ error: "Telefone inválido (apenas números, com DDD)." });
    if (!Validators.isValidEmail(email))
      return res.status(400).json({ error: "Formato de e-mail inválido." });

    try {
      const isUnique = await Validators.isEmailGloballyUnique(email);
      if (!isUnique) {
        return res.status(409).json({
          error: "Este e-mail já está sendo usado por outro usuário.",
        });
      }

      const newClient = await clientRepo.create({
        nome: nome.trim(),
        telefone: telefone.replace(/\D/g, ""),
        endereco: endereco.trim(),
        email: email.toLowerCase().trim(),
      });

      res.status(201).json(newClient);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Falha crítica ao criar cliente." + String(error) });
    }
  },

  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido." });

    const { nome, telefone, endereco, email } = req.body;

    if (!Validators.isValidString(nome, 3))
      return res.status(400).json({ error: "Nome inválido." });
    if (!Validators.isValidEmail(email))
      return res.status(400).json({ error: "E-mail inválido." });
    if (!Validators.isValidPhone(telefone))
      return res.status(400).json({ error: "Telefone inválido." });

    try {
      const isUnique = await Validators.isEmailGloballyUnique(
        email,
        id,
        "client"
      );
      if (!isUnique) {
        return res
          .status(409)
          .json({ error: "Este e-mail já está em uso no sistema." });
      }

      const updated = await clientRepo.update(id, {
        nome: nome.trim(),
        telefone: telefone.replace(/\D/g, ""),
        endereco: endereco.trim(),
        email: email.toLowerCase().trim(),
      });

      if (!updated)
        return res
          .status(404)
          .json({ error: "Cliente não encontrado para atualização." });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar cliente." });
    }
  },

  async delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido." });

    try {
      const client = await clientRepo.findById(id);
      if (!client)
        return res.status(404).json({ error: "Cliente não encontrado." });

      await clientRepo.delete(id);
      res.json({
        message: "Cliente e todo seu histórico foram deletados com sucesso.",
      });
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar cliente." });
    }
  },
};
