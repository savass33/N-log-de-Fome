import { Router } from "express";
import authRoutes from "./authRoutes";
import clientRoutes from "./clientRoutes";
import restaurantRoutes from "./restaurantRoutes";
import orderRoutes from "./orderRoutes";

const router = Router();

// Prefixo /api é definido no app.ts, aqui juntamos os grupos
router.use(authRoutes);
router.use(clientRoutes);
router.use(restaurantRoutes);
router.use(orderRoutes);

// Rota de teste geral
router.get("/teste", (req, res) =>
  res.json({ message: "API SQL Puro Funcionando!" })
);

export default router;
