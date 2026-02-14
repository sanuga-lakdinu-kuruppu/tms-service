import { Router } from "express";
import authController from "../../auth/controller/authController.mjs";
import taskController from "../../task/controller/taskController.mjs";
import userController from "../../user/controller/userController.mjs";

const router = Router();

router.use(authController);
router.use(taskController);
router.use(userController);

export default router;
