import 'dotenv/config';
import Log from './helpers/Logger';
import express, { Router } from 'express';
import helmet from 'helmet';
import contextMiddleware from './middleware/context.middleware';
import notfoundMiddleware from './middleware/notfound.middleware';
import errorMiddleware from './middleware/error.middleware';
import AuthRoutes from './routes/auth.routes';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';
import ConnectionEvent from './events/connection.event';
import GeneralRoutes from './routes/general.routes';
import protectionSocketMiddleware from './middleware/protectionSocket.middleware';

// Initialize Logger
Log.init(process.env.NODE_ENV, {
  logLevel: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  logFile: `${process.env.LOG_PATH}/kernel.$date.log`,
});

Log.info(this, `🚀 WebConnect API wird gestartet ... (v${process.env.npm_package_version})`);

const app = express();
const router = Router();

// Middlewares
app.use(cors());

router.use(helmet()); // --> Set all relevant security headers
router.use(express.json()); // --> Parse incoming requests with JSON payloads
router.use(contextMiddleware); // --> Add context to request

router.use(AuthRoutes.getRouter()); // --> Add Auth Routes
router.use(GeneralRoutes.getRouter()); // --> Add Auth Routes

router.use(notfoundMiddleware); // --> Handle 404
router.use(errorMiddleware); // --> Handle errors

app.use('/api', router);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.use(protectionSocketMiddleware); // --> Protection Middleware
io.on(ConnectionEvent.getEventName(), ConnectionEvent.action); // --> Attach Connection (and all other) listeners

// Start API
server.listen(process.env.API_PORT, () => {
  Log.info(this, `🚀 WebConnect API erfolgreich gestartet. Port: ${process.env.API_PORT}`);
});
