import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import dotenv from "dotenv";

dotenv.config();

const isLocal = process.env.ENVIRONMENT === "LOCAL";
const awsRegion = process.env.CURRENT_AWS_REGION;
const accessKeyId = process.env.ACCESSKEYID;
const secretAccessKey = process.env.SECRETACCESSKEY;

const client = new DynamoDBClient({
  region: awsRegion,
  credentials: isLocal
    ? {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      }
    : undefined,
});

export const ddb = DynamoDBDocumentClient.from(client);
