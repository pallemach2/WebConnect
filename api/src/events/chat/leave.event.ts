import { Socket } from 'socket.io';
import * as yup from 'yup';
import PrismaService from '../../services/prisma.service';
import SocketService from '../../services/socket.service';

class ChatLeaveEvent {
  static getEventName() {
    return 'chat-leave';
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

    await prisma.chatParticipant.delete({ where: { id: userParticipant.id } });

    // Inform other clients about new user
    socket.leave(data.chatId);
  }
}

export default ChatLeaveEvent;
