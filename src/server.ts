import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import pino from 'pino';
import authRoutes from './routes/auth';
import cors from 'cors';
import prisma from './prisma';
import authMiddleware from './middlewares/authMiddleware';
import feedRoutes from './routes/feed';

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
  level: process.env.LOG_LEVEL || 'info',
});

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const logStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
const logFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'common';

app.use(express.json());
app.use(morgan(logFormat, { stream: logStream }));
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:5173', `${process.env.FRONTEND_URL}`], // 👈 tu frontend
    credentials: true, // 👈 permite enviar cookies
  })
);
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    `default-src 'self'; connect-src 'self' ${process.env.BASEURL} ws://192.168.56.1:3001 http://localhost:5173 ${process.env.FRONTEND_URL}; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';`
  );
  next();
});

app.use('/auth', authRoutes);
app.use('/feed', feedRoutes);

app.get('/me', authMiddleware, async (req, res) => {
  const userId = (req as any).user.userId;
  const user = await prisma.osuUser.findUnique({ where: { id: userId } });
  res.json(user);
});

//if (process.env.NODE_ENV !== 'production') {
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});
//}

//export default app;
export { logger };
