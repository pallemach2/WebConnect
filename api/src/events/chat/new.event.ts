// Package imports
import { Socket } from 'socket.io';
import * as yup from 'yup';

// Custom imports
import PrismaService from '@services/prisma.service';
import SocketService from '@services/socket.service';

class ChatNewEvent {
  static getEventName() {
    return 'chat-new';
  }

  static async action(socket: Socket, data: any, cb: Function) {
    try {
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

      for (let i = 0; i < data.users.length; i += 1) {
        await prisma.user.findFirstOrThrow({ where: { username: data.users[i] } });
      }

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

      cb();
    } catch (e) {
      cb(e);
    }
  }
}

export default ChatNewEvent;
