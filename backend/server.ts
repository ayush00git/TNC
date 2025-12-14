import express, { urlencoded } from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";

// functions
import { connectToMongo } from "./services/connection"

// routes
import { chatRoute } from "./routes/chat"
import { authRoute } from "./routes/auth";
import { allowOnlyAuthenticatedUser } from "./middlewares/auth";

const app = express();

const mongoUri = process.env.MONGO_URI;

if(!mongoUri) {
    throw new Error(`MONGO_URI is not present in the environment variables`);
}

connectToMongo(mongoUri)
  .then(() => console.log(`Connected to MongoDB`))
  .catch((e: string) =>
    console.log(`Error while connecting to database: ${e}`)
  );

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}))

app.use(express.json());
app.use(urlencoded({ extended: true }));  

app.get("/", allowOnlyAuthenticatedUser ,(req, res) => {
  return res
    .status(200)
    .json({ message: "Hey the server is in development phase" });
});

app.use('/api/chatRoom', chatRoute);
app.use('/api/auth', authRoute)

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Backend Working: http://localhost:${PORT}`));
