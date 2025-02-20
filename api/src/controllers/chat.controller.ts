// Package imports
import { Response as Rs, NextFunction as Nx } from 'express';
import * as yup from 'yup';

// Custom imports
import Rq from '@interfaces/request.interface';
import PrismaService from '@services/prisma.service';
import SocketService from '@services/socket.service';

/**
 * Controls all Auth actions
 */
class ChatController {
  /**
   * GET /all
   * @param req
   * @param res
   * @param next
   */
  static all = async (req: Rq, res: Rs, next: Nx): Promise<void> => {
    try {
      const prisma = PrismaService.getInstance();

      const chatParticipants = await prisma.chatParticipant.findMany({
        where: { userId: req.ctx.user.id },
        select: { chatId: true },
      });

      const chatIds: string[] = [];
      chatParticipants.forEach((cp) => chatIds.push(cp.chatId));

      const chats = await prisma.chat.findMany({
        where: {
          id: { in: chatIds },
        },
        select: {
          id: true,
          avatar: true,
          name: true,
          createdAt: true,
          ChatParticipant: {
            select: {
              id: true,
              admin: true,
              creator: true,
              User: {
                select: {
                  id: true,
                  username: true,
                  avatar: true,
                  lastSeen: true,
                },
              },
            },
          },
          Message: {
            select: {
              id: true,
              content: true,
              createdAt: true,
              updatedAt: true,
              edited: true,
              MessageSeen: {
                select: {
                  id: true,
                  ChatParticipant: {
                    select: {
                      id: true,
                      userId: true,
                    },
                  },
                  timestamp: true,
                },
              },
              ChatParticipant: {
                select: {
                  id: true,
                  User: {
                    select: {
                      id: true,
                      username: true,
                    },
                  },
                },
              },
            },
            // take: 50,
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });

      res.json(chats);
    } catch (e) {
      next(e);
    }
  };

  /**
   * GET /:id
   * @param req
   * @param res
   * @param next
   */
  static get = async (req: Rq, res: Rs, next: Nx): Promise<void> => {
    try {
      // Define and validate params
      const schema = yup.object().shape({
        id: yup.string().required('api.errors.validator.idNotEmpty'),
      });
      await schema.validate(req.params);

      const prisma = PrismaService.getInstance();

      await prisma.chatParticipant.findFirstOrThrow({
        where: { userId: req.ctx.user.id, chatId: req.params.id },
        select: { chatId: true },
      });

      const chat = await prisma.chat.findFirstOrThrow({
        where: {
          id: req.params.id,
        },
        select: {
          id: true,
          avatar: true,
          name: true,
          ChatParticipant: {
            select: {
              id: true,
              admin: true,
              creator: true,
              User: {
                select: {
                  id: true,
                  username: true,
                  avatar: true,
                  lastSeen: true,
                },
              },
            },
          },
          Message: {
            select: {
              id: true,
              content: true,
              createdAt: true,
              edited: true,
              ChatParticipant: {
                select: {
                  id: true,
                  User: {
                    select: {
                      id: true,
                      username: true,
                    },
                  },
                },
              },
            },
            take: 50,
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
      });

      res.json(chat);
    } catch (e) {
      next(e);
    }
  };

  /**
   * GET /:id/messages/:page
   * @param req
   * @param res
   * @param next
   */
  static getMessagesAfterCursor = async (req: Rq, res: Rs, next: Nx): Promise<void> => {
    try {
      // Define and validate params
      const schema = yup.object().shape({
        id: yup.string().required('api.errors.validator.idNotEmpty'),
        cursor: yup.string().required('api.errors.validator.pageNotEmpty'),
      });
      await schema.validate(req.params);

      const prisma = PrismaService.getInstance();

      await prisma.chatParticipant.findFirstOrThrow({
        where: { userId: req.ctx.user.id, chatId: req.params.id },
        select: { chatId: true },
      });

      const messages = await prisma.message.findMany({
        where: {
          chatId: req.params.id,
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
          edited: true,
          ChatParticipant: {
            select: {
              id: true,
              User: {
                select: {
                  id: true,
                  username: true,
                },
              },
            },
          },
        },
        cursor: {
          id: req.params.cursor,
        },
        take: 50,
        orderBy: {
          createdAt: 'asc',
        },
      });

      res.json(messages);
    } catch (e) {
      next(e);
    }
  };

  /**
   * GET /:id/messages
   * @param req
   * @param res
   * @param next
   */
  static getMessages = async (req: Rq, res: Rs, next: Nx): Promise<void> => {
    try {
      // Define and validate params
      const schema = yup.object().shape({
        id: yup.string().required('api.errors.validator.idNotEmpty'),
      });
      await schema.validate(req.params);

      const prisma = PrismaService.getInstance();

      await prisma.chatParticipant.findFirstOrThrow({
        where: { userId: req.ctx.user.id, chatId: req.params.id },
        select: { chatId: true },
      });

      const messages = await prisma.message.findMany({
        where: {
          chatId: req.params.id,
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
          edited: true,
          ChatParticipant: {
            select: {
              id: true,
              User: {
                select: {
                  id: true,
                  username: true,
                },
              },
            },
          },
        },
        take: 50,
        orderBy: {
          createdAt: 'asc',
        },
      });

      res.json(messages);
    } catch (e) {
      next(e);
    }
  };

  /**
   * POST /:id/messages
   * @param req
   * @param res
   * @param next
   */
  static uploadAvatar = async (req: Rq, res: Rs, next: Nx): Promise<void> => {
    try {
      if (!req.file) {
        res.status(500).json({ error: 'No file uploaded' });
      } else {
        // Define and validate params
        const schema = yup.object().shape({
          id: yup.string().required('api.errors.validator.idNotEmpty'),
        });
        await schema.validate(req.params);

        const prisma = PrismaService.getInstance();
        await prisma.chat.update({ where: { id: req.params.id }, data: { avatar: req.file.filename } });

        // Send changes to all users in room
        if (SocketService.server) {
          SocketService.server.to(req.params.id).emit('chat-edit');
        }

        res.json({ message: 'File uploaded successfully', filename: req.file.filename });
      }
    } catch (e) {
      next(e);
    }
  };
}

export default ChatController;
