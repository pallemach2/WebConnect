// Package imports
import { Socket } from 'socket.io';

// Custom imports
import SocketService from '@services/socket.service';
import PrismaService from '@services/prisma.service';

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
      socket.on(event.default.getEventName(), (data: any) => event.default.action(socket, data));
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
  }
}

export default ConnectionEvent;
