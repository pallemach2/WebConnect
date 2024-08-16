// Package imports
import { Socket } from 'socket.io';
import * as yup from 'yup';

// Custom imports
import SocketService from '@services/socket.service';
import PrismaService from '@services/prisma.service';
import Logger from '@helpers/Logger';

class MessageDeleteEvent {
  static getEventName() {
    return 'message-delete';
  }

  static async action(socket: Socket, data: any) {
    try {
      // Define and validate params
      const schema = yup.object().shape({
        messageId: yup.string().required('api.errors.validator.messageIdNotEmpty'),
      });
      await schema.validate(data);

      const prisma = PrismaService.getInstance();

      // Get users
      const user = SocketService.getUser(socket);
      const message = await prisma.message.findFirstOrThrow({
        where: { id: data.messageId },
        select: {
          id: true,
          ChatParticipant: {
            select: {
              id: true,
              userId: true,
            },
          },
          chatId: true,
        },
      });

      // Check if message is own message
      if (message.ChatParticipant.userId === user.id) {
        await prisma.message.delete({ where: { id: message.id } });

        // Say to clients to join room
        socket.to(message.chatId).emit('message-delete', { messageId: message.id });
      }
    } catch (e) {
      Logger.error(e);
    }
  }
}

export default MessageDeleteEvent;
