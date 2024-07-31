// Package imports
import { Socket } from 'socket.io';
import * as yup from 'yup';

// Custom imports
import PrismaService from '@services/prisma.service';
import SocketService from '@services/socket.service';

class ChatDeleteEvent {
  static getEventName() {
    return 'chat-delete';
  }

  static async action(socket: Socket, data: any) {
    // Define and validate params
    const schema = yup.object().shape({
      chatId: yup.string().required('api.errors.validator.chatIdNotEmpty'),
    });
    await schema.validate(data);

    const prisma = PrismaService.getInstance();

    const user = SocketService.getUser(socket);
    const userParticipant = await prisma.chatParticipant.findFirstOrThrow({
      where: { userId: user.id, chatId: data.chatId },
    });

    // Update Chat
    if (userParticipant.admin) {
      await prisma.chat.delete({ where: { id: data.chatId } });
    } else {
      return;
    }

    // Inform other clients about deletion and close room
    socket.to(data.chatId).emit('chat-leave', data.chatId);
    socket.in(data.chatId).socketsLeave(data.chatId);
  }
}

export default ChatDeleteEvent;
