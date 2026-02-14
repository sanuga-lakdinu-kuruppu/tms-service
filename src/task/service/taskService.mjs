import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "../../common/config/db.mjs";
import { RETURN } from "../../common/error/returnCodes.mjs";
import { generateUUID } from "../../common/util/util.mjs";
import { TASK_STATUS } from "../enum/taskStatus.mjs";

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
