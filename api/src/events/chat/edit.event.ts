// Package imports
import { Socket } from 'socket.io';
import * as yup from 'yup';

// Custom imports
import PrismaService from '@services/prisma.service';
import SocketService from '@services/socket.service';

class ChatEditEvent {
  static getEventName() {
    return 'chat-edit';
  }

  static async action(socket: Socket, data: any) {
    // Define and validate params
    const schema = yup.object().shape({
      chatId: yup.string().required('api.errors.validator.chatIdNotEmpty'),
      name: yup.string().required('api.errors.validator.userIdNotEmpty'),
    });
    await schema.validate(data);

    const prisma = PrismaService.getInstance();

    const user = SocketService.getUser(socket);
    let chat = await prisma.chat.findFirstOrThrow({ where: { id: data.chatId } });
    const userParticipant = await prisma.chatParticipant.findFirstOrThrow({
      where: { userId: user.id, chatId: chat.id },
    });

    // Update Chat
    if (userParticipant.admin) {
      chat = await prisma.chat.update({
        where: {
          id: chat.id,
        },
        data: {
          name: data.name,
        },
      });
    } else {
      return;
    }

    // Inform other clients about new user
    socket.to(chat.id).emit('chat-edit', chat);
  }
}

export default ChatEditEvent;
