import { Request, Response } from "express";
import { AuthRepository } from "../repositories/AuthRepository";
import { Validators } from "../utils/validators";

const authRepo = new AuthRepository();

export const AuthController = {
  async login(req: Request, res: Response) {
    const { email, role } = req.body;

    if (!email) return res.status(400).json({ error: "Email é obrigatório." });
    if (!Validators.isValidEmail(email))
      return res.status(400).json({ error: "Formato de email inválido." });

    try {
      const user = await authRepo.findUserByEmail(email, role);
      if (!user) {
        return res
          .status(404)
          .json({
            error: "Usuário não encontrado. Verifique o perfil selecionado.",
          });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Erro no login." });
    }
  },

  async createAdmin(req: Request, res: Response) {
    const { nome, telefone, email } = req.body;

    if (!Validators.isValidEmail(email))
      return res.status(400).json({ error: "Email inválido." });

    try {
      // Validação Global
      const isUnique = await Validators.isEmailGloballyUnique(email);
      if (!isUnique)
        return res
          .status(409)
          .json({ error: "Este e-mail já está em uso no sistema." });

      const newAdmin = await authRepo.createAdmin(nome, email, telefone);
      res.status(201).json(newAdmin);
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  },
};
