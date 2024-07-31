// Package imports
import { Response, NextFunction } from 'express';
import Jwt from 'jsonwebtoken';

// Custom imports
import Request from '@interfaces/request.interface';
import UserService from '@services/user.service';
import { JwtPayload } from '@interfaces/auth.interface';

// Protect a route and add user and to context
async function protectionMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const tk = req.headers['x-webconnect-token'];
    if (!tk) throw new Error('api.errors.tokenHeaderMissing');

    try {
      const decoded = Jwt.verify(tk as string, process.env.API_SECRET) as JwtPayload;

      const user = await UserService.findById(decoded.userId);

      // Delete sensible informations
      delete user.password;

      // Set userdata in ctx
      req.ctx.user = user;
      req.ctx.token = '';

      next();
    } catch (e) {
      throw new Error('api.errors.sessionExpired');
    }
  } catch (e) {
    res.status(401);
    next(e);
  }
}

export default protectionMiddleware;
