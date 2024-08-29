// Package imports
import { Socket, Server } from 'socket.io';
import { User } from '@prisma/client';
import protectionSocketMiddleware from '@middleware/protectionSocket.middleware';
import ConnectionEvent from '@events/connection.event';

class SocketService {
  socketLocals = new WeakMap<Socket, User>();
  server: Server | null = null;

  getUser(socket: Socket) {
    return this.socketLocals.get(socket);
  }

  setUser(socket: Socket, user: User) {
    return this.socketLocals.set(socket, user);
  }

  startServer(server: any) {
    server = new Server(server, {
      transports: ['websocket'],
    });

    server.use(protectionSocketMiddleware); // --> Protection Middleware
    server.on(ConnectionEvent.getEventName(), ConnectionEvent.action); // --> Attach Connection (and all other) listeners
  }
}

const x = new SocketService();
export default x;
