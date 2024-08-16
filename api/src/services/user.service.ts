// Package imports
import { PasswordForgot, PrismaClient, User } from '@prisma/client';

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

  /**
   * Generate a forgot password code
   * @param userid
   * @returns
   */
  static forgotPassword = async (userId: string): Promise<PasswordForgot> => {
    const prisma = PrismaService.getInstance();

    // Delete all older entries to prevent error
    await prisma.passwordForgot.deleteMany({
      where: {
        userId,
      },
    });

    // Create new entry
    const result = await prisma.passwordForgot.create({
      data: {
        validUntil: new Date(Date.now() + 86400 * 1000),
        userId,
      },
    });

    return result;
  };

  /**
   * Generate a forgot password code
   * @param userid
   * @returns
   */
  static forgotPasswordChange = async (code: string, password: string): Promise<User> => {
    const prisma = PrismaService.getInstance();

    // find forgot password entry
    const forgotPassword = await prisma.passwordForgot.findUnique({
      where: {
        id: code,
      },
      select: {
        id: true,
        validUntil: true,
        userId: true,
      },
    });

    // Check received code
    if (!forgotPassword) throw new Error('api.errors.authentication.forgotPasswordCodeInvalid');
    if (forgotPassword.validUntil.getTime() < Date.now())
      throw new Error('api.errors.authentication.forgotPasswordCodeExpired');

    // Change password and delete password forgot entry
    const user = await this.changePassword(forgotPassword.userId, password);
    await prisma.passwordForgot.delete({ where: { id: code } });

    return user;
  };
}

export default UserService;
