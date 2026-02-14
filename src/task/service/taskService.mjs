import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "../../common/config/db.mjs";
import { RETURN } from "../../common/error/returnCodes.mjs";
import { generateUUID } from "../../common/util/util.mjs";
import { TASK_STATUS } from "../enum/taskStatus.mjs";

export const createTask = async (data, user) => {
  const now = new Date().toISOString();

  const newTask = {
    taskId: generateUUID(),
    userId: user.userId,
    createdAt: now,
    updatedAt: now,
    name: data.name,
    description: data.description,
    priority: data.priority,
    status: TASK_STATUS.CREATED,
  };

  await ddb.send(
    new PutCommand({
      TableName: process.env.TABLE_TASK,
      Item: newTask,
    })
  );

  const returnTask = {
    taskId: newTask.taskId,
    name: newTask.name,
    description: newTask.description,
    priority: newTask.priority,
    status: newTask.status,
  };

  console.log(`task ${returnTask.taskId} saved successfully`);
  return { res: RETURN.SUCCESS, value: { task: returnTask } };
};
