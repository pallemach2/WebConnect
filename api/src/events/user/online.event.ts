// Package imports
import { Socket } from 'socket.io';

// Custom imports
import SocketService from '@services/socket.service';
import PrismaService from '@services/prisma.service';

class UserOnlineEvent {
  static getEventName() {
    return 'user-online';
  }

  static async action(socket: Socket) {
    // Fetch user
    let user = SocketService.getUser(socket);

    // Fetch active chats
    const prisma = PrismaService.getInstance();
    user = await prisma.user.update({
      data: {
        lastSeen: new Date(),
      },
      where: {
        id: user.id,
      },
    });

    const chats = await prisma.chatParticipant.findMany({
      where: {
        userId: user.id,
      },
      select: {
        chatId: true,
      },
    });

    // Join all chat rooms
    chats.forEach((chat) => {
      socket.broadcast.to(chat.chatId).emit('user-online', { userId: user.id, lastSeen: user.lastSeen });
    });
  }
}

export default UserOnlineEvent;
