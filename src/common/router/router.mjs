import { Router } from "express";
import authController from "../../auth/controller/authController.mjs";
import taskController from "../../task/controller/taskController.mjs";
import userController from "../../user/controller/userController.mjs";
import { csrfProtection } from "../middleware/commonMiddleware.mjs";

const router = Router();

router.get("/v1/csrf-token", csrfProtection, (req, res) => {
  res.status(200).json({ csrfToken: req.csrfToken() });
});

router.use(authController);
router.use(taskController);
router.use(userController);

export default router;
