import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { connectToMongo } from "./services/connection"

import { chatRoute } from "./routes/chat"

const app = express();

const PORT = process.env.PORT || 8000;
const mongoUri = process.env.MONGO_URI;

if(!mongoUri) {
    throw new Error(`MONGO_URI is not present in the environment variables`);
}

connectToMongo(mongoUri)
  .then(() => console.log(`Connected to MongoDB`))
  .catch((e: string) =>
    console.log(`Error while connecting to database: ${e}`)
  );

app.get("/", (req, res) => {
  return res
    .status(200)
    .json({ message: "Hey the server is in development phase" });
});

app.use('/chatRoom', chatRoute);

app.listen(8000, () => console.log(`Backend Working: http://localhost:8000`));
