import { Router } from "express";
import authRoutes from "./authRoutes";
import clientRoutes from "./clientRoutes";
import restaurantRoutes from "./restaurantRoutes";
import orderRoutes from "./orderRoutes";

const router = Router();

router.use(authRoutes);
router.use(clientRoutes);
router.use(restaurantRoutes);
router.use(orderRoutes);

router.get("/teste", (req, res) =>
  res.json({ message: "API SQL Puro Funcionando!" })
);

export default router;
