// Package imports
import { Socket } from 'socket.io';
import * as yup from 'yup';

// Custom imports
import SocketService from '@services/socket.service';
import PrismaService from '@services/prisma.service';
import Logger from '@helpers/Logger';

class MessageNewEvent {
  static getEventName() {
    return 'message-new';
  }

  static async action(socket: Socket, data: any, cb: any) {
    try {
      // Define and validate params
      const schema = yup.object().shape({
        chatId: yup.string().required('api.errors.validator.chatIdNotEmpty'),
        content: yup.string().required('api.errors.validator.contentNotEmpty'),
      });
      await schema.validate(data);

      const prisma = PrismaService.getInstance();

      const user = SocketService.getUser(socket);
      const { chatId, content } = data as { chatId: string; content: string };
      const participant = await prisma.chatParticipant.findFirstOrThrow({ where: { userId: user.id, chatId } });

      // Save Message
      const message = await prisma.message.create({
        data: {
          chatId,
          chatParticipantId: participant.id,
          content: content,
        },
        select: {
          id: true,
          content: true,
          ChatParticipant: {
            select: {
              id: true,
              userId: true,
            },
          },
          MessageSeen: {
            select: {
              id: true,
              chatParticipantId: true,
              timestamp: true,
            },
          },
          chatId: true,
        },
      });

      // Send new Message back to sender
      cb(message);

      // Broadcast
      socket.in(chatId).emit('message-new', message);
    } catch (e) {
      Logger.error(e);
    }
  }
}

export default MessageNewEvent;
