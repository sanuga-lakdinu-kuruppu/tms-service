import {
  PutCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { ddb } from "../../common/config/db.mjs";
import { RETURN } from "../../common/error/returnCodes.mjs";
import { generateUUID } from "../../common/util/util.mjs";
import { TASK_STATUS } from "../enum/taskStatus.mjs";

export const deleteTaskById = async (user, taskId) => {
  //get task by id
  const {
    res,
    value: { task },
  } = await getTaskById(taskId);
  if (res !== RETURN.SUCCESS) {
    console.log(`task ${taskId} not found :)`);
    return { res: RETURN.NOT_FOUND, value: { task: null } };
  }

  //check if user is authorized to delete the task
  if (task.userId !== user.userId) {
    console.log(
      `user ${user.userId} is not authorized to delete task ${taskId} :)`
    );
    return { res: RETURN.UNAUTHORIZED, value: { task: null } };
  }

  //delete task
  const deleteParams = {
    TableName: process.env.TABLE_TASK,
    Key: {
      taskId: task.taskId,
      createdAt: task.createdAt,
    },
  };

  await ddb.send(new DeleteCommand(deleteParams));
  console.log(`task ${taskId} deleted successfully :)`);
  return {
    res: RETURN.SUCCESS,
    value: { taskId: taskId },
  };
};

export const updateTaskById = async (user, data, taskId) => {
  //get task by id
  const {
    res: getRes,
    value: { task },
  } = await getTaskById(taskId);
  if (getRes !== RETURN.SUCCESS) {
    console.log(`task ${taskId} not found :)`);
    return { res: RETURN.NOT_FOUND, value: { task: null } };
  }

  //check if user is authorized to update the task
  if (task.userId !== user.userId) {
    console.log(
      `user ${user.userId} is not authorized to update task ${taskId} :)`
    );
    return { res: RETURN.UNAUTHORIZED, value: { task: null } };
  }

  //update task
  const now = new Date().toISOString();
  const params = {
    TableName: process.env.TABLE_TASK,
    Key: {
      taskId: taskId,
      createdAt: task.createdAt,
    },
    UpdateExpression:
      "set #name = :name, #description = :description, #priority = :priority, #status = :status, #updatedAt = :updatedAt",
    ExpressionAttributeValues: {
      ":name": data.name,
      ":description": data.description,
      ":priority": data.priority,
      ":status": data.status,
      ":updatedAt": now,
    },
    ExpressionAttributeNames: {
      "#name": "name",
      "#description": "description",
      "#priority": "priority",
      "#status": "status",
      "#updatedAt": "updatedAt",
    },
    ReturnValues: "ALL_NEW",
  };

  const result = await ddb.send(new UpdateCommand(params));

  //get minimal task object
  const returnTask = {
    taskId: result.Attributes.taskId,
    name: result.Attributes.name,
    description: result.Attributes.description,
    priority: result.Attributes.priority,
    status: result.Attributes.status,
    createdAt: result.Attributes.createdAt,
    updatedAt: result.Attributes.updatedAt,
  };

  console.log(`task ${taskId} updated successfully :)`);
  return {
    res: RETURN.SUCCESS,
    value: { task: returnTask },
  };
};

export const getTaskById = async (taskId) => {
  const params = {
    TableName: process.env.TABLE_TASK,
    KeyConditionExpression: "taskId = :tid",
    ExpressionAttributeValues: {
      ":tid": taskId,
    },
    Limit: 1,
    ScanIndexForward: false,
  };

  const result = await ddb.send(new QueryCommand(params));
  if (!result.Items || result.Items.length === 0) {
    console.log(`task ${taskId} not found :)`);
    return {
      res: RETURN.NOT_FOUND,
      value: { task: null },
    };
  }

  return {
    res: RETURN.SUCCESS,
    value: { task: result.Items[0] },
  };
};

export const getAllTasks = async (user, limit, startKey) => {
  const params = {
    TableName: process.env.TABLE_TASK,
    IndexName: "userIdCreatedAtIndex",
    KeyConditionExpression: "userId = :uid",
    ExpressionAttributeValues: {
      ":uid": user.userId,
    },
    ProjectionExpression:
      "#taskId, #name, #description, #status, #priority, #createdAt, #updatedAt",
    ExpressionAttributeNames: {
      "#taskId": "taskId",
      "#name": "name",
      "#description": "description",
      "#status": "status",
      "#priority": "priority",
      "#createdAt": "createdAt",
      "#updatedAt": "updatedAt",
    },
    Limit: limit,
    ScanIndexForward: false,
  };

  if (startKey) {
    try {
      params.ExclusiveStartKey = JSON.parse(decodeURIComponent(startKey));
    } catch (error) {
      return {
        res: RETURN.SUCCESS,
        value: { tasks: [], nextToken: null },
      };
    }
  }

  const result = await ddb.send(new QueryCommand(params));

  console.log(`tasks retrived successfully :)`);
  return {
    res: RETURN.SUCCESS,
    value: {
      tasks: result.Items,
      nextToken: result.LastEvaluatedKey
        ? encodeURIComponent(JSON.stringify(result.LastEvaluatedKey))
        : null,
    },
  };
};

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
    createdAt: newTask.createdAt,
    updatedAt: newTask.updatedAt,
  };

  console.log(`task ${returnTask.taskId} saved successfully`);
  return { res: RETURN.SUCCESS, value: { task: returnTask } };
};
