import { Socket } from 'socket.io';
import SocketService from '../../services/socket.service';
import * as yup from 'yup';
import PrismaService from '../../services/prisma.service';

class MessageSeenEvent {
  static getEventName() {
    return 'message-seen';
  }

  static async action(socket: Socket, data: any) {
    // Define and validate params
    const schema = yup.object().shape({
      messageId: yup.string().required('api.errors.validator.messageIdNotEmpty'),
    });
    await schema.validate(data);

    const prisma = PrismaService.getInstance();

    // Get users
    const user = SocketService.getUser(socket);
    const message = await prisma.message.findFirstOrThrow({ where: { id: data.messageId } });
    const chatParticipant = await prisma.chatParticipant.findFirstOrThrow({
      where: { userId: user.id, chatId: message.chatId },
    });

    // Create chat and participant for creator
    const messageSeen = await prisma.messageSeen.create({
      data: {
        messageId: message.id,
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

    // Say to clients to join room
    socket.to(message.chatId).emit('message-seen', messageSeen);
  }
}

export default MessageSeenEvent;
