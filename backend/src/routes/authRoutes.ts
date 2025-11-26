import { Router } from "express";
import { AuthController } from "../controllers/AuthController";

const router = Router();

router.post("/auth/login", AuthController.login);
router.post("/admins", AuthController.createAdmin);

export default router;
