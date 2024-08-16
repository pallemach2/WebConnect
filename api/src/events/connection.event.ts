// Package imports
import { Socket } from 'socket.io';
import Jwt from 'jsonwebtoken';

// Custom imports
import SocketService from '@services/socket.service';
import PrismaService from '@services/prisma.service';
import { JwtPayload } from '@interfaces/auth.interface';

class ConnectionEvent {
  static getEventName() {
    return 'connection';
  }

  static async action(socket: Socket) {
    // Fetch user
    const user = SocketService.getUser(socket);

    // Fetch active chats
    const prisma = PrismaService.getInstance();
    const chats = await prisma.chatParticipant.findMany({
      where: {
        userId: user.id,
      },
      select: {
        chatId: true,
      },
    });

    // Join in a room for user
    socket.join(user.id);

    // Join all chat rooms
    chats.forEach((chat) => {
      socket.join(chat.chatId);
    });

    // Function to register event
    const registerEvent = (event: any) => {
      socket.on(event.default.getEventName(), (data: any, callback: any) =>
        event.default.action(socket, data, callback),
      );
    };

    // Attach user listeners
    registerEvent(await import('./user/online.event'));

    // Attach Chat listeners
    registerEvent(await import('./chat/new.event'));
    registerEvent(await import('./chat/leave.event'));
    registerEvent(await import('./chat/join.event'));
    registerEvent(await import('./chat/invite.event'));
    registerEvent(await import('./chat/edit.event'));
    registerEvent(await import('./chat/delete.event'));

    // Attach message listeners
    registerEvent(await import('./message/new.event'));
    registerEvent(await import('./message/edit.event'));
    registerEvent(await import('./message/delete.event'));
    registerEvent(await import('./message/seen.event'));

    // Do auth challenge every 60 seconds
    while (socket.connected) {
      const wait = new Promise((resolve) => setTimeout(resolve, 60000));
      await wait;

      socket.timeout(5000).emit('auth-challenge', async (err: boolean, token: string) => {
        try {
          // No answer from client
          if (err) {
            throw new Error();
          } else {
            // Validate JWT
            const decoded = Jwt.verify(token, process.env.API_SECRET) as JwtPayload;
            const user = SocketService.getUser(socket);

            if (user.id !== decoded.userId) throw new Error();
          }
        } catch (e) {
          // Disconnect if auth challenge is not fullfilled
          socket.disconnect(true);
        }
      });
    }
  }
}

export default ConnectionEvent;
