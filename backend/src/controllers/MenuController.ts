import { Request, Response } from "express";
import { MenuRepository } from "../repositories/MenuRepository";
import { Validators } from "../utils/validators";

const menuRepo = new MenuRepository();

export const MenuController = {
  async getByRestaurant(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido." });
    try {
      const items = await menuRepo.findByRestaurant(id);
      res.json(items);
    } catch (e) {
      res.status(500).json({ error: "Erro ao buscar menu." });
    }
  },

  async create(req: Request, res: Response) {
    const { id_restaurante_fk, nome, descricao, preco, categoria, imagem_url } =
      req.body;

    if (!id_restaurante_fk)
      return res.status(400).json({ error: "Restaurante não informado." });
    if (!Validators.isValidString(nome, 2))
      return res.status(400).json({ error: "Nome do item inválido." });
    if (Number(preco) <= 0)
      return res.status(400).json({ error: "Preço deve ser maior que zero." });
    if (!Validators.isValidString(categoria, 2))
      return res.status(400).json({ error: "Categoria obrigatória." });

    try {
      const exists = await menuRepo.findByNameInRestaurant(
        Number(id_restaurante_fk),
        nome.trim()
      );
      if (exists)
        return res
          .status(409)
          .json({ error: "Já existe um item com este nome no seu cardápio." });

      const novo = await menuRepo.create({
        id_restaurante_fk: Number(id_restaurante_fk),
        nome: nome.trim(),
        descricao: descricao?.trim(),
        preco: Number(preco),
        categoria: categoria.trim(),
        imagem_url,
      });
      res.status(201).json(novo);
    } catch (e) {
      res.status(500).json({ error: String(e) });
    }
  },

  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido." });

    const { nome, descricao, preco, categoria, imagem_url } = req.body;

    if (Number(preco) <= 0)
      return res.status(400).json({ error: "Preço inválido." });

    try {
      const updated = await menuRepo.update(id, {
        nome: nome.trim(),
        descricao: descricao?.trim(),
        preco: Number(preco),
        categoria: categoria.trim(),
        imagem_url,
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
      await menuRepo.delete(id);
      res.json({ message: "Item removido." });
    } catch (e) {
      res.status(500).json({ error: "Erro ao remover." });
    }
  },
};
