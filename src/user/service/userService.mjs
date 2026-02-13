import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "../../common/config/db.mjs";
import { RETURN } from "../../common/error/returnCodes.mjs";
import { generateUUID } from "../../common/util/util.mjs";
import { USER_TYPES } from "../enum/userType.mjs";
import { USER_STATUS } from "../enum/userStatus.mjs";

export const createUser = async ({
  email,
  firstName,
  lastName,
  hashedPassword,
}) => {
  const now = new Date().toISOString();

  const newUser = {
    userId: generateUUID(),
    createdAt: now,
    updatedAt: now,
    email,
    firstName,
    lastName,
    password: hashedPassword,
    role: USER_TYPES.MEMBER,
    loginCount: 0,
    status: USER_STATUS.ACTIVE,
  };

  await ddb.send(
    new PutCommand({
      TableName: process.env.TABLE_USER,
      Item: newUser,
    })
  );

  console.log(`user ${newUser.userId} saved successfully`);
  return { res: RETURN.SUCCESS, value: { user: newUser } };
};

export const getUserByEmail = async (email) => {
  const params = {
    TableName: process.env.TABLE_USER,
    IndexName: "emailIndex",
    KeyConditionExpression: "#e = :e",
    ExpressionAttributeNames: {
      "#e": "email",
    },
    ExpressionAttributeValues: {
      ":e": email,
    },
    Limit: 1,
    ScanIndexForward: false,
  };

  const result = await ddb.send(new QueryCommand(params));
  if (!result.Items || result.Items.length === 0) {
    console.log(`user ${email} not found :)`);
    return {
      res: RETURN.NOT_FOUND,
      value: { user: null },
    };
  }

  return {
    res: RETURN.SUCCESS,
    value: { user: result.Items[0] },
  };
};
