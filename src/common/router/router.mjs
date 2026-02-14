import { Router } from "express";
import authController from "../../auth/controller/authController.mjs";
import taskController from "../../task/controller/taskController.mjs";

const router = Router();

router.use(authController);
router.use(taskController);

export default router;
