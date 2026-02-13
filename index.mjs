import express from "express";
import cors from "cors";
import awsServerlessExpress from "aws-serverless-express";
import dotenv from "dotenv";

const app = express();

dotenv.config();

app.use(express.json());
app.use(cors());

app.get("/v1/health", (req, res) => {
  res.status(200).send("tms-service is up and running :)");
});

const PORT = process.env.PORT || 6006;
app.listen(PORT, () => {
  console.log(`tms-service is up and running on port ${PORT} :)`);
});

// const server = awsServerlessExpress.createServer(app);
// export const handler = (event, context) => {
//   awsServerlessExpress.proxy(server, event, context);
// };
