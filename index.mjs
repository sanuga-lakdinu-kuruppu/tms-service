import express from "express";
import cors from "cors";
import awsServerlessExpress from "aws-serverless-express";
import dotenv from "dotenv";
import router from "./src/common/router/router.mjs";
import cookieParser from "cookie-parser";

const app = express();

dotenv.config();

app.use(cookieParser());
app.use(express.json());

const allowedOrigin =
  process.env.ENVIRONMENT === "PROD"
    ? "https://halfliferoi.online"
    : "http://localhost:3000";

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);
app.use(router);

app.get("/v1/health", (req, res) => {
  res.status(200).send("tms-service is up and running :)");
});

// use this for local development
// const PORT = process.env.PORT || 6006;
// app.listen(PORT, () => {
//   console.log(`tms-service is up and running on port ${PORT} :)`);
// });

// use this for lambda deployment
const server = awsServerlessExpress.createServer(app);
export const handler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context);
};
