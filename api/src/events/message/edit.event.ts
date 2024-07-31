import { Socket } from 'socket.io';
import SocketService from '../../services/socket.service';
import * as yup from 'yup';
import PrismaService from '../../services/prisma.service';

class MessageEditEvent {
  static getEventName() {
    return 'message-edit';
  }

  static async action(socket: Socket, data: any) {
    // Define and validate params
    const schema = yup.object().shape({
      messageId: yup.string().required('api.errors.validator.messageIdNotEmpty'),
      content: yup.string().required('api.errors.validator.contentNotEmpty'),
    });
    await schema.validate(data);

    const prisma = PrismaService.getInstance();

    // Get users
    const user = SocketService.getUser(socket);
    let message = await prisma.message.findFirstOrThrow({
      where: { id: data.messageId },
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

    // Check if message is own message
    if (message.ChatParticipant.userId === user.id) {
      message = await prisma.message.update({
        where: {
          id: message.id,
        },
        data: {
          content: data.content,
          edited: true,
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

      // Say to clients to join room
      socket.to(message.chatId).emit('message-edit', message);
    }
  }
}

export default MessageEditEvent;
