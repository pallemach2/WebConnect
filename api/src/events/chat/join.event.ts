// Package imports
import { Socket } from 'socket.io';
import * as yup from 'yup';

// Custom imports
import PrismaService from '@services/prisma.service';

class ChatJoinEvent {
  static getEventName() {
    return 'chat-join';
  }

  static async action(socket: Socket, data: any) {
    // Define and validate params
    const schema = yup.object().shape({
      chatId: yup.string().required('api.errors.validator.chatIdNotEmpty'),
    });
    await schema.validate(data);

    const prisma = PrismaService.getInstance();
    const chat = await prisma.chat.findFirstOrThrow({ where: { id: data.chatId } });

    // Creator joins room
    socket.join(chat.id);
  }
}

export default ChatJoinEvent;
