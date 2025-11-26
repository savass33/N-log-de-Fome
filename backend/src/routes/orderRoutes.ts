import { Router } from "express";
import { OrderController } from "../controllers/OrderController";

const router = Router();

router.get("/pedidos", OrderController.getAll);
router.get("/pedidos/:id", OrderController.getById);
router.get("/pedidos/restaurante/:id", OrderController.getByRestaurant);
router.get("/pedidos/cliente/:id", OrderController.getByClient);
router.post("/pedidos", OrderController.create);
router.put("/pedidos/:id", OrderController.updateStatus);

export default router;
