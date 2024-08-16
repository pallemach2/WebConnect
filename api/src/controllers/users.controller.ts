// Package imports
import { Response as Rs, NextFunction as Nx } from 'express';

// Custom imports
import Rq from '@interfaces/request.interface';
import PrismaService from '@services/prisma.service';

/**
 * Controls all Auth actions
 */
class UsersController {
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
        select: {
          chatId: true,
          Chat: {
            select: {
              ChatParticipant: {
                select: {
                  userId: true,
                },
              },
            },
          },
        },
      });

      // Build array with all userIds
      let userIds: string[] = [];
      chatParticipants.forEach((cp) => {
        cp.Chat.ChatParticipant.forEach((cp2) => userIds.push(cp2.userId));
      });

      // Remove dupes
      userIds = [...new Set(userIds)];

      const users = await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, username: true, avatar: true, lastSeen: true },
      });

      res.json(users);
    } catch (e) {
      next(e);
    }
  };
}

export default UsersController;
