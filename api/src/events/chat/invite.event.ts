// Package imports
import { Socket } from 'socket.io';
import * as yup from 'yup';

// Custom imports
import PrismaService from '@services/prisma.service';
import SocketService from '@services/socket.service';

class ChatInviteEvent {
  static getEventName() {
    return 'chat-invite';
  }

  static async action(socket: Socket, data: any) {
    // Define and validate params
    const schema = yup.object().shape({
      chatId: yup.string().required('api.errors.validator.chatIdNotEmpty'),
      userId: yup.string().required('api.errors.validator.userIdNotEmpty'),
    });
    await schema.validate(data);

    const prisma = PrismaService.getInstance();

    const user = SocketService.getUser(socket);
    const chat = await prisma.chat.findFirstOrThrow({ where: { id: data.chatId } });
    const userParticipant = await prisma.chatParticipant.findFirstOrThrow({
      where: { userId: user.id, chatId: chat.id },
    });
    const invitedUser = await prisma.chat.findFirstOrThrow({ where: { id: data.userId } });

    if (userParticipant.admin) {
      await prisma.chatParticipant.create({
        data: {
          chatId: chat.id,
          userId: invitedUser.id,
        },
      });
    }

    // Inform other clients about new user
    socket.to(chat.id).emit('user-new', {
      username: user.username,
      lastSeen: user.lastSeen,
      avatar: user.avatar,
      id: user.id,
    });

    // Creator joins room
    socket.join(chat.id);
  }
}

export default ChatInviteEvent;
