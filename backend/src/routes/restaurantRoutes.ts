import { Router } from "express";
import { RestaurantRepository } from "../repositories/RestaurantRepository";
import { MenuRepository } from "../repositories/MenuRepository";

const router = Router();
const restRepo = new RestaurantRepository();
const menuRepo = new MenuRepository();

// --- Restaurantes ---
router.get("/restaurantes", async (req, res) => {
  const data = await restRepo.findAll();
  res.json(data);
});

router.get("/restaurantes/:id", async (req, res) => {
  const data = await restRepo.findById(Number(req.params.id));
  if (!data) return res.status(404).json({ error: "Não encontrado" });
  res.json(data);
});

router.post("/restaurantes", async (req, res) => {
  try {
    const exists = await restRepo.findByEmailOrName(
      req.body.email,
      req.body.nome
    );
    if (exists)
      return res
        .status(409)
        .json({ error: "Restaurante já existe (nome ou email)." });

    const novo = await restRepo.create(req.body);
    res.status(201).json(novo);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.put("/restaurantes/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const exists = await restRepo.findByEmailOrName(
      req.body.email,
      req.body.nome,
      id
    );
    if (exists)
      return res
        .status(409)
        .json({ error: "Conflito de dados (nome ou email)." });

    const updated = await restRepo.update(id, req.body);
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.delete("/restaurantes/:id", async (req, res) => {
  await restRepo.delete(Number(req.params.id));
  res.json({ message: "Deletado" });
});

// --- Cardápio (Menu) ---
router.get("/cardapio/restaurante/:id", async (req, res) => {
  const items = await menuRepo.findByRestaurant(Number(req.params.id));
  res.json(items);
});

router.post("/cardapio", async (req, res) => {
  const exists = await menuRepo.findByNameInRestaurant(
    req.body.id_restaurante_fk,
    req.body.nome
  );
  if (exists)
    return res.status(409).json({ error: "Item já existe no cardápio." });

  const novo = await menuRepo.create(req.body);
  res.status(201).json(novo);
});

router.put("/cardapio/:id", async (req, res) => {
  const updated = await menuRepo.update(Number(req.params.id), req.body);
  res.json(updated);
});

router.delete("/cardapio/:id", async (req, res) => {
  await menuRepo.delete(Number(req.params.id));
  res.json({ message: "Item removido" });
});

export default router;
