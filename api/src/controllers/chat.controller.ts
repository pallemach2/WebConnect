// Package imports
import { Response as Rs, NextFunction as Nx } from 'express';

// Custom imports
import Rq from '@interfaces/request.interface';
import PrismaService from '@services/prisma.service';

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
            orderBy: {
              createdAt: 'asc',
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
}

export default ChatController;
