// Package imports
import { Response, NextFunction } from 'express';

// Custom imports
import Request from '../interfaces/request.interface';

function notfoundMiddleware(req: Request, res: Response, next: NextFunction): void {
  res.status(404);
  const error = new Error(`🔍 - Kein Endpunkt verfügbar - ${req.originalUrl}`);
  next(error);
}

export default notfoundMiddleware;
