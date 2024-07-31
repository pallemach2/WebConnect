// Package imports
import { PrismaClient, Session, User } from '@prisma/client';
import jwt from 'jsonwebtoken';

// Custom imports
import Log from '@helpers/Logger';
import PrismaService from '@services/prisma.service';
import EncryptionService from '@services/encryption.service';

class SessionService {
  /**
   * Create a auth session, token + refreshtoken
   * @param user
   * @returns Promise<Session>
   */
  static createSession = async (user: User, prismaClient?: PrismaClient): Promise<Session> => {
    const prisma = prismaClient || PrismaService.getInstance();

    try {
      // Generate JWTs for access and refresh token
      const token = jwt.sign({ userId: user.id }, process.env.API_SECRET as string, {
        expiresIn: 40, // 15 min.
      });
      const tokenExpire = Date.now() + 900 * 1000;

      const refreshToken = jwt.sign({ userId: user.id }, process.env.API_REFRESH_SECRET as string, {
        expiresIn: 2592000, // 30 days
      });
      const refreshExpire = Date.now() + 2592000 * 1000;

      // Encrypt tokens for DB
      const tokenEncrypted = await EncryptionService.hash(token);

      // create session in db
      const session = await prisma.session.create({
        data: {
          token: tokenEncrypted,
          tokenExpire: new Date(tokenExpire),
          refreshToken,
          refreshTokenExpire: new Date(refreshExpire),
          User: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      // return un-encrypted tokens for user
      session.token = token;

      return session;
    } catch (e) {
      throw new Error(e);
    }
  };

  /**
   * Refresh a session with a generated token and refreshtoken
   * @param token
   * @param refreshToken
   * @returns Promise<Session>
   */
  static refreshSession = async (
    token: string,
    refreshToken: string,
    prismaClient?: PrismaClient,
  ): Promise<Session> => {
    const prisma = prismaClient || PrismaService.getInstance();

    try {
      // Check token
      jwt.verify(token, process.env.API_SECRET as string, {
        ignoreExpiration: true,
      }) as { userId: string };

      // decode refreshToken
      const payload = jwt.verify(refreshToken, process.env.API_REFRESH_SECRET as string) as { userId: string };

      // find session
      const session = await prisma.session.findFirstOrThrow({
        where: {
          refreshToken,
        },
      });

      // check token
      if (!(await EncryptionService.match(token, session.token)))
        throw new Error('api.errors.authentication.wrongToken');

      // check user
      const user = await prisma.user.findFirstOrThrow({
        where: { id: payload.userId },
      });
      if (session.userId !== user.id) throw new Error('api.errors.authentication.refreshTokenAndUserNotMatch');

      // create new session
      const newSession = await this.createSession(user);

      // delete old session
      await this.deleteSession(session.id);

      return newSession;
    } catch (e) {
      throw new Error(e);
    }
  };

  /**
   * Deletes a session
   * @param id
   */
  static deleteSession = async (id: string): Promise<void> => {
    const prisma = PrismaService.getInstance();

    try {
      await prisma.session.delete({
        where: {
          id,
        },
      });
    } catch (e) {
      // throw new Error(e);
      Log.error(this, e);
    }
  };

  /**
   * Deletes all sessions of a user
   * @param userId
   */
  static deleteAllSessions = async (userId: string): Promise<void> => {
    const prisma = PrismaService.getInstance();

    try {
      await prisma.session.deleteMany({
        where: {
          userId,
        },
      });
    } catch (e) {
      // throw new Error(e);
      Log.error(this, e);
    }
  };
}

export default SessionService;
