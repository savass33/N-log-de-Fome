import { Router } from "express";
import { ClientController } from "../controllers/ClientController";

const router = Router();

router.get("/clientes", ClientController.getAll);
router.get("/clientes/:id", ClientController.getById);
router.post("/clientes", ClientController.create);
router.put("/clientes/:id", ClientController.update);
router.delete("/clientes/:id", ClientController.delete);

export default router;
