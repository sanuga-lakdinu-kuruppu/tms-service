import { Router } from "express";
import { checkSchema, matchedData, validationResult } from "express-validator";
import { RETURN } from "../../common/error/returnCodes.mjs";
import { USER_TYPES } from "../../user/enum/userType.mjs";
import { protectRoute } from "../../auth/middleware/authMiddleware.mjs";
import { createTaskSchema, updateTaskSchema } from "../schema/taskSchemas.mjs";
import {
  createTask,
  deleteTaskById,
  getAllTasks,
  updateTaskById,
} from "../service/taskService.mjs";

const router = Router();

router.post(
  "/v1/tasks",
  protectRoute([USER_TYPES.MEMBER]),
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

router.get(
  "/v1/tasks",
  protectRoute([USER_TYPES.MEMBER]),
  async (request, response) => {
    try {
      const { user } = request;
      const limit = parseInt(request.query.limit) || 10;
      const startKey = request.query.startKey || null;

      //request processing
      const { res, value } = await getAllTasks(user, limit, startKey);
      if (res === RETURN.SUCCESS) {
        console.log(`task retriving process successfull :)`);
        return response.status(200).send({
          msg: "Task retriving successfully",
          data: {
            tasks: value.tasks,
            limit: limit,
            nextToken: value.nextToken,
            hasMore: !!value.nextToken,
          },
        });
      } else {
        console.log(`task retriving process unsuccessfull :)`);
        return response.status(500).send({
          msg: "Oops! Something went wrong on our end. Please try again later.",
        });
      }
    } catch (error) {
      console.log(`Error during task retriving process: ${error}`);
      return response.status(500).send({
        msg: "Oops! Something went wrong on our end. Please try again later.",
      });
    }
  }
);

router.put(
  "/v1/tasks/:taskId",
  protectRoute([USER_TYPES.MEMBER]),
  checkSchema(updateTaskSchema),
  async (request, response) => {
    try {
      //request validation
      const result = validationResult(request);
      if (!result.isEmpty()) {
        console.log(
          `error occured during validation: ${result.errors[0].msg} :)`
        );
        return response.status(400).send({ error: result.errors[0].msg });
      }
      const data = matchedData(request);
      const { user } = request;
      const { taskId } = request.params;

      //request processing
      const { res, value } = await updateTaskById(user, data, taskId);
      if (res === RETURN.SUCCESS) {
        console.log(`task update process successfull :)`);
        return response.status(200).send({
          msg: "Task update successfully",
          data: { task: value.task },
        });
      } else if (res === RETURN.NOT_FOUND) {
        console.log(`task not found :)`);
        return response.status(404).send({
          msg: "Task not found",
        });
      } else if (res === RETURN.UNAUTHORIZED) {
        console.log(`task not authorized :)`);
        return response.status(401).send({
          msg: "You are not authorized to update this task",
        });
      } else {
        console.log(`Task update process unsuccessful :)`);
        return response.status(500).send({
          msg: "Oops! Something went wrong on our end. Please try again later.",
        });
      }
    } catch (error) {
      console.log(`error during task update process: ${error}`);
      return response.status(500).send({
        msg: "Oops! Something went wrong on our end. Please try again later.",
      });
    }
  }
);

router.delete(
  "/v1/tasks/:taskId",
  protectRoute([USER_TYPES.MEMBER]),
  async (request, response) => {
    try {
      const { user } = request;
      const { taskId } = request.params;

      //request processing
      const { res, value } = await deleteTaskById(user, taskId);
      if (res === RETURN.SUCCESS) {
        console.log(`task deleting process successfull :)`);
        return response.status(200).send({
          msg: "Task deleted successfully",
          data: {
            taskId: value.taskId,
          },
        });
      } else if (res === RETURN.NOT_FOUND) {
        console.log(`task not found :)`);
        return response.status(404).send({
          msg: "Task not found",
        });
      } else if (res === RETURN.UNAUTHORIZED) {
        console.log(`task not authorized :)`);
        return response.status(401).send({
          msg: "You are not authorized to delete this task",
        });
      } else {
        console.log(`task deleting process unsuccessfull :)`);
        return response.status(500).send({
          msg: "Oops! Something went wrong on our end. Please try again later.",
        });
      }
    } catch (error) {
      console.log(`error occured during processing: ${error} :)`);
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
