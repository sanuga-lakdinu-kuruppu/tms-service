import { Router } from "express";
import authController from "../../auth/controller/authController.mjs";

const router = Router();

router.use(authController);

export default router;
