// Package imports
import 'dotenv/config';
import express, { Router } from 'express';
import helmet from 'helmet';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';
import path from 'path';

// Custom imports
import Log from '@helpers/Logger';
import contextMiddleware from '@middleware/context.middleware';
import notfoundMiddleware from '@middleware/notfound.middleware';
import errorMiddleware from '@middleware/error.middleware';
import protectionSocketMiddleware from '@middleware/protectionSocket.middleware';
import ConnectionEvent from '@events/connection.event';

// Routes import
import AuthRoutes from '@routes/auth.routes';
import GeneralRoutes from '@routes/general.routes';
import ChatRoutes from '@routes/chat.routes';
import UsersRoutes from '@routes/users.routes';
import SocketService from '@services/socket.service';

const main = async () => {
  // Initialize Logger
  Log.init(process.env.NODE_ENV, {
    logLevel: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    logFile: `${process.env.LOG_PATH}/kernel.$date.log`,
  });

  Log.info(this, `🚀 WebConnect API wird gestartet ... (v${process.env.npm_package_version})`);

  const app = express();
  const router = Router();

  // Serve public
  app.use(express.static(path.join(__dirname, 'public')));

  // Middlewares
  app.use(cors());

  router.use(helmet()); // --> Set all relevant security headers
  router.use(express.json()); // --> Parse incoming requests with JSON payloads
  router.use(contextMiddleware); // --> Add context to request

  router.use(AuthRoutes.getRouter()); // --> Add Auth Routes
  router.use(GeneralRoutes.getRouter()); // --> Add Auth Routes
  router.use(ChatRoutes.getRouter()); // --> Add Auth Routes
  router.use(UsersRoutes.getRouter()); // --> Add Users Routes

  router.use(notfoundMiddleware); // --> Handle 404
  router.use(errorMiddleware); // --> Handle errors

  app.use('/api', router);

  // Start Socket server
  const server = http.createServer(app);
  SocketService.startServer(server);

  // Start API
  server.listen(process.env.API_PORT, () => {
    Log.info(this, `🚀 WebConnect API erfolgreich gestartet. Port: ${process.env.API_PORT}`);
  });
};

main();
