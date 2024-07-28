// Package imports
import { NextFunction, Response } from 'express';
import Request from '../interfaces/request.interface';
import PrismaService from 'services/prisma.service';

// Attach Context
function contextMiddleware(req: Request, res: Response, next: NextFunction): void {
  req.ctx = {
    token: '',
  };

  next();
}

export default contextMiddleware;
