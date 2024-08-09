// Package imports
import { NextFunction, Response } from 'express';

// Custom imports
import Request from '@interfaces/request.interface';

// Attach Context
function contextMiddleware(req: Request, res: Response, next: NextFunction): void {
  res.setHeader('Content-Type', 'application/json');

  req.ctx = {
    token: '',
  };

  next();
}

export default contextMiddleware;
