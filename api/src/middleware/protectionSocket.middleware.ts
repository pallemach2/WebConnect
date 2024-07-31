// Package imports
import Jwt from 'jsonwebtoken';

// Custom imports
import UserService from '../services/user.service';
import { JwtPayload } from 'interfaces/auth.interface';
import { Socket } from 'socket.io';
import SocketService from '../services/socket.service';

// Protect a route and add user and to context
async function protectionSocketMiddleware(socket: Socket, next: any): Promise<void> {
  try {
    const tk = socket.handshake.auth.token;
    if (!tk) throw new Error('api.errors.tokenHeaderMissing');

    // Decode JWT
    const decoded = Jwt.verify(tk as string, process.env.API_SECRET) as JwtPayload;
    const user = await UserService.findById(decoded.userId);

    // Save user for socket
    SocketService.setUser(socket, user);

    next();
  } catch (e) {
    console.log(e);
    next(e);
  }
}

export default protectionSocketMiddleware;
