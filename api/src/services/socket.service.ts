// Package imports
import { Server, Socket } from 'socket.io';
import { User } from '@prisma/client';

export const socketLocals = new WeakMap<Socket, User>();

class SocketService {
  static getUser(socket: Socket) {
    return socketLocals.get(socket);
  }

  static setUser(socket: Socket, user: User) {
    return socketLocals.set(socket, user);
  }
}

export default SocketService;
