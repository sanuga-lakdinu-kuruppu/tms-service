import { Router } from "express";
import { checkSchema, matchedData, validationResult } from "express-validator";
import { RETURN } from "../../common/error/returnCodes.mjs";
import { USER_TYPES } from "../../user/enum/userType.mjs";
import { protectRoute } from "../../auth/middleware/authMiddleware.mjs";
import { createTaskSchema } from "../schema/taskSchemas.mjs";
import { createTask } from "../service/taskService.mjs";

const router = Router();

router.post(
  "/v1/tasks",
  protectRoute([USER_TYPES.MEMBER, USER_TYPES.SUPER_ADMIN]),
  checkSchema(createTaskSchema),
  async (request, response) => {
    try {
      //request validation
      const result = validationResult(request);
      if (!result.isEmpty()) {
        console.log(`error occured during validation: ${result.errors[0].msg}`);
        return response.status(400).send({ msg: result.errors[0].msg });
      }
      const data = matchedData(request);
      const { user } = request;

      //request processing
      const { res, value } = await createTask(data, user);
      if (res === RETURN.SUCCESS) {
        console.log(`task created successfully`);
        return response.status(200).send({
          msg: "You have successfully created a task.",
          data: {
            task: value.task,
          },
        });
      } else {
        console.log(`task creation failed`);
        return response.status(500).send({
          msg: "Oops! Something went wrong on our end. Please try again later.",
        });
      }
    } catch (error) {
      console.log(`error during task creation: ${error}`);
      return response.status(500).send({
        msg: "Oops! Something went wrong on our end. Please try again later.",
      });
    }
  }
);

router.all("/tasks", (request, response) => {
  console.log(`method not allowed :)`);
  return response.status(405).send({ error: "method not allowed" });
});

export default router;
