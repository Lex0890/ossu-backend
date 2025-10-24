"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const pino_1 = __importDefault(require("pino"));
const auth_1 = __importDefault(require("./routes/auth"));
const cors_1 = __importDefault(require("cors"));
const prisma_1 = __importDefault(require("./prisma"));
const authMiddleware_1 = __importDefault(require("./middlewares/authMiddleware"));
const logger = (0, pino_1.default)({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
        },
    },
    level: process.env.LOG_LEVEL || 'info',
});
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 3000;
const logStream = node_fs_1.default.createWriteStream(node_path_1.default.join(__dirname, 'access.log'), { flags: 'a' });
const logFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'common';
app.use(express_1.default.json());
app.use((0, morgan_1.default)(logFormat, { stream: logStream }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173', `${process.env.FRONTEND_URL}`], // 👈 tu frontend
    credentials: true, // 👈 permite enviar cookies
}));
app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', `default-src 'self'; connect-src 'self' ${process.env.BASEURL} ws://192.168.56.1:3001 http://localhost:5173 ${process.env.FRONTEND_URL}; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';`);
    next();
});
app.use('/auth', auth_1.default);
app.get('/me', authMiddleware_1.default, async (req, res) => {
    const userId = req.user.userId;
    const user = await prisma_1.default.osuUser.findUnique({ where: { id: userId } });
    res.json(user);
});
app.listen(PORT, '0.0.0.0', () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
});
exports.default = logger;
