// Package imports
import { Socket } from 'socket.io';
import * as yup from 'yup';

// Custom imports
import PrismaService from '@services/prisma.service';
import SocketService from '@services/socket.service';
import Logger from '@helpers/Logger';

class MessageSeenEvent {
  static getEventName() {
    return 'message-seen';
  }

  static async action(socket: Socket, data: any, cb: any) {
    try {
      // Define and validate params
      const schema = yup.object().shape({
        messageIds: yup.array(yup.string()).required('api.errors.validator.messageIdsNotEmpty'),
      });
      await schema.validate(data);

      const prisma = PrismaService.getInstance();

      // Get users
      const user = SocketService.getUser(socket);
      const message = await prisma.message.findFirstOrThrow({ where: { id: { in: data.messageIds } } });
      const chatParticipant = await prisma.chatParticipant.findFirstOrThrow({
        where: { userId: user.id, chatId: message.chatId },
      });

      let results: any[] = [];
      data.messageIds.forEach(async (id: string) => {
        try {
          // Create chat and participant for creator
          const messageSeen = await prisma.messageSeen.create({
            data: {
              messageId: id,
              chatParticipantId: chatParticipant.id,
            },
            select: {
              id: true,
              timestamp: true,
              messageId: true,
              ChatParticipant: {
                select: {
                  id: true,
                  userId: true,
                },
              },
            },
          });

          results.push(messageSeen);
        } catch (e) {
          console.log(e);
        }
      });

      // Send results to requesting client
      cb(results);

      // Say to clients to join room
      socket.to(message.chatId).emit('message-seen', results);
    } catch (e) {
      Logger.error(this, e);
    }
  }
}

export default MessageSeenEvent;
