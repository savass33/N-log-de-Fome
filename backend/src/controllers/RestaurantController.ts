import { Request, Response } from "express";
import { RestaurantRepository } from "../repositories/RestaurantRepository";
import { OrderRepository } from "../repositories/OrderRepository";
import { Validators } from "../utils/validators";

const restRepo = new RestaurantRepository();
const orderRepo = new OrderRepository();

export const RestaurantController = {
  async getAll(req: Request, res: Response) {
    try {
      const data = await restRepo.findAll();
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: "Erro ao listar restaurantes." });
    }
  },

  async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido." });

    try {
      const data = await restRepo.findById(id);
      if (!data)
        return res.status(404).json({ error: "Restaurante não encontrado." });
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: "Erro interno." });
    }
  },

  async create(req: Request, res: Response) {
    const { nome, telefone, tipo_cozinha, email, endereco } = req.body;

    // 1. Validações Rigorosas
    if (!Validators.isValidString(nome, 2))
      return res.status(400).json({ error: "Nome do restaurante inválido." });
    if (!Validators.isValidString(tipo_cozinha, 3))
      return res.status(400).json({ error: "Tipo de cozinha obrigatório." });
    if (!Validators.isValidString(endereco, 5))
      return res.status(400).json({ error: "Endereço obrigatório." });
    if (!Validators.isValidEmail(email))
      return res.status(400).json({ error: "E-mail inválido." });
    if (!Validators.isValidPhone(telefone))
      return res.status(400).json({ error: "Telefone inválido." });

    try {
      // 2. Validação de Nome Duplicado (Regra de Negócio)
      const existsName = await restRepo.findByEmailOrName("", nome); // Passa email vazio para checar só nome
      if (existsName && existsName.nome.toLowerCase() === nome.toLowerCase()) {
        return res
          .status(409)
          .json({ error: "Já existe um restaurante com este nome exato." });
      }

      // 3. Validação Global de Email
      const isUniqueEmail = await Validators.isEmailGloballyUnique(email);
      if (!isUniqueEmail) {
        return res
          .status(409)
          .json({
            error:
              "Este e-mail já está cadastrado em outra conta.",
          });
      }

      const novo = await restRepo.create({
        nome: nome.trim(),
        telefone: telefone.replace(/\D/g, ""),
        tipo_cozinha: tipo_cozinha.trim(),
        email: email.toLowerCase().trim(),
        endereco: endereco.trim(),
      });
      res.status(201).json(novo);
    } catch (e) {
      res.status(500).json({ error: String(e) });
    }
  },

  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido." });

    const { nome, telefone, tipo_cozinha, email, endereco } = req.body;

    // Validações repetidas para segurança
    if (!Validators.isValidString(nome, 2))
      return res.status(400).json({ error: "Nome inválido." });
    if (!Validators.isValidEmail(email))
      return res.status(400).json({ error: "E-mail inválido." });

    try {
      // Valida Nome (excluindo o próprio ID)
      const existsName = await restRepo.findByEmailOrName("", nome, id);
      if (existsName && existsName.nome.toLowerCase() === nome.toLowerCase()) {
        return res
          .status(409)
          .json({ error: "Este nome já está em uso por outro restaurante." });
      }

      // Valida Email Global (excluindo o próprio ID)
      const isUnique = await Validators.isEmailGloballyUnique(
        email,
        id,
        "restaurant"
      );
      if (!isUnique)
        return res
          .status(409)
          .json({ error: "Este e-mail já está em uso no sistema." });

      const updated = await restRepo.update(id, {
        nome: nome.trim(),
        telefone: telefone.replace(/\D/g, ""),
        tipo_cozinha: tipo_cozinha.trim(),
        email: email.toLowerCase().trim(),
        endereco: endereco.trim(),
      });
      res.json(updated);
    } catch (e) {
      res.status(500).json({ error: String(e) });
    }
  },

  async delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido." });

    try {
      const orders = await orderRepo.findByRestaurant(id);
      if (orders.length > 0)
        return res
          .status(400)
          .json({
            error:
              "Impossível excluir: Restaurante possui histórico de pedidos.",
          });

      await restRepo.delete(id);
      res.json({ message: "Restaurante deletado com sucesso." });
    } catch (e) {
      res.status(500).json({ error: String(e) });
    }
  },
};
