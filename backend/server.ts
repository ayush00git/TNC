import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";

// functions
import { connectToMongo } from "./services/connection"
import { socketSetup } from "./services/socket";
// routes
import { chatRoute } from "./routes/chat"
import { authRoute } from "./routes/auth";
import { roomRoute } from "./routes/room";
import { allowOnlyAuthenticatedUser } from "./middlewares/auth";

const app = express();
app.use(cors());

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: `http://localhost:5173`,
    methods: ["GET", "POST"],
  }
});

socketSetup(io);

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
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", allowOnlyAuthenticatedUser ,(req, res) => {
  return res
    .status(200)
    .json({ message: "Hey the server is in development phase" });
});

app.use('/api/chatRoom', allowOnlyAuthenticatedUser,chatRoute);
app.use('/api/auth', authRoute);
app.use('/api/room', allowOnlyAuthenticatedUser, roomRoute);

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => console.log(`Server started on - http://localhost:${PORT}`));