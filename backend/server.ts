import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";

dotenv.config();

// functions
import { connectToMongo } from "./services/connection"
import { socketSetup } from "./services/socket";

// routes
import { chatRoute } from "./routes/chat"
import { authRoute } from "./routes/auth";
import { roomRoute } from "./routes/room";
import { featureRoute } from "./routes/feature";
import { blogRoute } from "./routes/blog";

// middlewares
import { allowOnlyAuthenticatedUser } from "./middlewares/auth";

const app = express();
const server = createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  "http://13.202.26.208",
  "https://tnc.ayushz.me",
  "https://ayushz.me",
  "https://www.ayushz.me",
]

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if( !origin ) return callback(null, true); // for mobile app as they have no origin

      if( allowedOrigins.includes(origin) ) { 
        callback(null, true);
      } else {
        console.log("Socket blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  }
});

app.set("io", io);
socketSetup(io);

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  throw new Error(`MONGO_URI is not present in the environment variables`);
}

connectToMongo(mongoUri)
  .then(() => console.log(`Connected to MongoDB`))
  .catch((e: string) =>
    console.log(`Error while connecting to database: ${e}`)
  );

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // for mobile app as they have no origin

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("API blocked by CORS:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", allowOnlyAuthenticatedUser, (req, res) => {
  return res
    .status(200)
    .json({ message: "Hey welcome to the TNC server" });
});

app.use('/api/chat', allowOnlyAuthenticatedUser, chatRoute);
app.use('/api/auth', authRoute);
app.use('/api/room', allowOnlyAuthenticatedUser, roomRoute);
app.use('/api/features', featureRoute);
app.use('/api/blog', blogRoute);

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => console.log(`Server started on - http://localhost:${PORT}`));
