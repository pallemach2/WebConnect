import { Socket } from 'socket.io';
import SocketService from '../../services/socket.service';
import * as yup from 'yup';
import PrismaService from '../../services/prisma.service';

class ChatNewEvent {
  static getEventName() {
    return 'chat-new';
  }

  static async action(socket: Socket, data: any) {
    // Define and validate params
    const schema = yup.object().shape({
      name: yup.string().required('api.errors.validator.nameNotEmpty'),
      users: yup.array().of(yup.string()).required('api.errors.validator.usersNotEmpty'),
    });
    await schema.validate(data);

    const prisma = PrismaService.getInstance();

    // Get users
    const user = SocketService.getUser(socket);
    const users = await prisma.user.findMany({ where: { username: { in: data.users } } });

    // Create chat and participant for creator
    const chat = await prisma.chat.create({
      data: {
        ChatParticipant: {
          create: {
            userId: user.id,
            creator: true,
            admin: true,
          },
        },
        name: data.name,
      },
    });

    // Creator joins room
    socket.join(chat.id);

    // Create participants for all others
    users.forEach(async (u) => {
      await prisma.chatParticipant.create({
        data: {
          userId: u.id,
          chatId: chat.id,
        },
      });

      // Say to clients to join room
      socket.to(u.id).emit('chat-join');
    });
  }
}

export default ChatNewEvent;
