"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
// functions
const connection_1 = require("./services/connection");
const socket_1 = require("./services/socket");
// routes
const chat_1 = require("./routes/chat");
const auth_1 = require("./routes/auth");
const room_1 = require("./routes/room");
const auth_2 = require("./middlewares/auth");
const app = (0, express_1.default)();
// app.use(cors()); // REMOVED: conflicting with specific cors config below
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: `http://localhost:5173`,
        methods: ["GET", "POST"],
        credentials: true,
    }
});
app.set("io", io);
(0, socket_1.socketSetup)(io);
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    throw new Error(`MONGO_URI is not present in the environment variables`);
}
(0, connection_1.connectToMongo)(mongoUri)
    .then(() => console.log(`Connected to MongoDB`))
    .catch((e) => console.log(`Error while connecting to database: ${e}`));
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.get("/", auth_2.allowOnlyAuthenticatedUser, (req, res) => {
    return res
        .status(200)
        .json({ message: "Hey the server is in development phase" });
});
app.use('/api/chat', auth_2.allowOnlyAuthenticatedUser, chat_1.chatRoute);
app.use('/api/auth', auth_1.authRoute);
app.use('/api/room', auth_2.allowOnlyAuthenticatedUser, room_1.roomRoute);
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server started on - http://localhost:${PORT}`));
