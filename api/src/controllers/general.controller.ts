// Package imports
import { Response as Rs, NextFunction as Nx } from 'express';
import * as yup from 'yup';

// Custom imports
import Rq from '@interfaces/request.interface';
import PrismaService from '@services/prisma.service';

/**
 * Controls all Auth actions
 */
class GeneralController {
  /**
   * GET /ping
   * @param req
   * @param res
   * @param next
   */
  static ping = async (req: Rq, res: Rs, next: Nx): Promise<void> => {
    try {
      // const a = new Promise((resolve, reject) => setTimeout(() => resolve(true), 2000));
      // await a;

      res.json('pong.');
    } catch (e) {
      next(e);
    }
  };

  /**
   * POST /avatar
   * @param req
   * @param res
   * @param next
   */
  static uploadAvatar = async (req: Rq, res: Rs, next: Nx): Promise<void> => {
    try {
      if (!req.file) {
        res.status(500).json({ error: 'No file uploaded' });
      } else {
        const prisma = PrismaService.getInstance();
        await prisma.user.update({ where: { id: req.ctx.user.id }, data: { avatar: req.file.filename } });

        res.json({ message: 'File uploaded successfully', filename: req.file.filename });
      }
    } catch (e) {
      next(e);
    }
  };
}

export default GeneralController;
