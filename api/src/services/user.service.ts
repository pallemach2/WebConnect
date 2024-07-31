// Package imports
import { PrismaClient, User } from '@prisma/client';

// Custom imports
import PrismaService from '@services/prisma.service';
import EncryptionService from '@services/encryption.service';
import SessionService from '@services/session.service';

class UserService {
  /**
   * Creates a user
   * @param email
   * @param password
   * @param username
   * @returns
   */
  static create = async (email: string, password: string, username: string): Promise<User> => {
    const prisma = PrismaService.getInstance();

    const result = await prisma.user.create({
      data: {
        email,
        password,
        username,
      },
    });

    return result;
  };

  /**
   * Findes a user by its email
   * @param email
   * @returns
   */
  static findByMail = async (email: string): Promise<User> => {
    const prisma = PrismaService.getInstance();
    const result = await prisma.user.findFirst({ where: { email } });

    return result;
  };

  /**
   * Findes a user by its username
   * @param username
   * @returns
   */
  static findByUsername = async (username: string): Promise<User> => {
    const prisma = PrismaService.getInstance();
    const result = await prisma.user.findFirst({ where: { username } });

    return result;
  };

  /**
   * Findes a user by its id
   * @param email
   * @returns
   */
  static findById = async (id: string): Promise<User> => {
    const prisma = PrismaService.getInstance();
    const result = await prisma.user.findFirst({ where: { id } });

    return result;
  };

  /**
   * Changes the password of a user and deletes all sessions
   * @param userId
   * @param password
   */
  static changePassword = async (userId: string, password: string, prismaClient?: PrismaClient): Promise<User> => {
    const prisma = prismaClient || PrismaService.getInstance();

    // Check if password is valid. Min. 8 chars, one letter, one number
    const regex = /^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$/;
    if (regex.test(password) === true) throw new Error('api.errors.validator.passwordNotValid');

    // Hash password
    const passwordEncrypted = await EncryptionService.hash(password);

    // Save password
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: passwordEncrypted,
      },
    });

    await SessionService.deleteAllSessions(userId);

    return user;
  };
}

export default UserService;
