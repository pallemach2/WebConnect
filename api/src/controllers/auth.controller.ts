// Package imports
import { Response as Rs, NextFunction as Nx } from 'express';
import * as yup from 'yup';

// Custom imports
import Rq from '@interfaces/request.interface';
import EncryptionService from '@services/encryption.service';
import UserService from '@services/user.service';
import SessionService from '@services/session.service';

/**
 * Controls all Auth actions
 */
class AuthController {
  /**
   * POST /authenticate
   * @param req
   * @param res
   * @param next
   */
  static authenticate = async (req: Rq, res: Rs, next: Nx): Promise<void> => {
    try {
      // Define and validate params
      const schema = yup.object().shape({
        username: yup.string().required('api.errors.validator.usernameNotEmpty'),
        password: yup.string().required('api.errors.validator.passwordNotEmpty'),
      });
      await schema.validate(req.body);

      let user = null;

      // find user
      try {
        user = await UserService.findByUsername(req.body.username);
        if (!user) throw new Error();
      } catch (e) {
        throw new Error('api.errors.authentication.userNotFound');
      }

      // Check if the password is valid
      if (!EncryptionService.match(req.body.password, user.password)) {
        throw new Error('api.errors.authentication.wrongPassword');
      }

      // Create a session, remove sensible informations
      const session = await SessionService.createSession(user);

      delete session.id;
      delete session.createdAt;
      delete session.userId;

      res.json({ ...session, userId: user.id, username: user.username, avatar: user.avatar });
    } catch (e) {
      next(e);
    }
  };

  /**
   * POST /register
   * @param req
   * @param res
   * @param next
   */
  static register = async (req: Rq, res: Rs, next: Nx): Promise<void> => {
    try {
      // Define and validate params
      const schema = yup.object().shape({
        password: yup.string().required('api.errors.validator.passwordNotEmpty'),
        username: yup.string().required('api.errors.validator.usernameNotEmpty'),
        email: yup.string().required('api.errors.validator.emailNotEmpty'),
      });
      await schema.validate(req.body);

      // Check if user already exists
      const resMail = await UserService.findByMail(req.body.email);
      const resUsername = await UserService.findByUsername(req.body.email);

      if (resMail || resUsername) {
        throw new Error('api.errors.registration.userAlreadyExists');
      }

      // Check if password is valid. Min. 8 chars, one uppercase letter, one lowercase, one number, one special
      // If it doesnt match the regex, it is valid
      const regex = /^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$/;
      if (regex.test(req.body.password) === true) throw new Error('api.errors.registration.passwordNotValid');

      // Hash password
      const passwordEncrypted = await EncryptionService.hash(req.body.password);

      // Create user
      const newUser = await UserService.create(req.body.email, passwordEncrypted, req.body.username);

      // Create a session, remove sensible informations
      const session = await SessionService.createSession(newUser);

      delete session.id;
      delete session.createdAt;
      delete session.userId;

      res.json(session);
    } catch (e) {
      next(e);
    }
  };

  /**
   * POST /refresh
   * @param req
   * @param res
   * @param next
   */
  static refresh = async (req: Rq, res: Rs, next: Nx): Promise<void> => {
    try {
      // Define and validate params
      const schema = yup.object().shape({
        token: yup.string().required('api.errors.authentication.tokenNotEmpty'),
        refreshToken: yup.string().required('api.errors.authentication.refreshTokenNotEmpty'),
      });
      await schema.validate(req.body);

      // Create a session, remove sensible informations
      const session = await SessionService.refreshSession(req.body.token, req.body.refreshToken);

      delete session.id;
      delete session.createdAt;

      let user = null;

      // find user
      try {
        user = await UserService.findById(session.userId);
        if (!user) throw new Error();
      } catch (e) {
        throw new Error('api.errors.authentication.userNotFound');
      }

      res.json({ ...session, username: user.username, avatar: user.avatar });
    } catch (e) {
      next(e);
    }
  };

  /**
   * POST /password/forgot
   * @param req
   * @param res
   * @param next
   */
  static forgotPassword = async (req: Rq, res: Rs, next: Nx): Promise<void> => {
    try {
      // Define and validate params
      const schema = yup.object().shape({
        input: yup.string().required('api.errors.validator.inputNotEmpty'),
      });
      await schema.validate(req.body);

      let user = null;
      // find user
      try {
        user = await UserService.findByMail(req.body.input);

        if (!user) {
          user = await UserService.findByUsername(req.body.input);
        }

        if (!user) throw new Error();
      } catch (e) {
        throw new Error('api.errors.authentication.userNotFound');
      }

      // Create a forgot password entry
      const entry = await UserService.forgotPassword(user.id);

      // sent mail
      // await MailService.sendPasswordResetMail(user.email, entry.id, user.language);

      res.json({ message: 'Ok.', email: req.body.email });
    } catch (e) {
      next(e);
    }
  };

  /**
   * POST /password/forgot/change
   * @param req
   * @param res
   * @param next
   */
  static forgotPasswordChange = async (req: Rq, res: Rs, next: Nx): Promise<void> => {
    try {
      // Define and validate params
      const schema = yup.object().shape({
        code: yup.string().required('api.errors.validator.registerCodeNotEmpty'),
        password: yup.string().required('api.errors.validator.passwordNotEmpty'),
      });
      await schema.validate(req.body);

      // Change password
      const user = await UserService.forgotPasswordChange(req.body.code, req.body.password);

      // Sent mail
      // await MailService.sendPasswordChangedMail(user.email, user.language);

      res.json({ message: 'Ok.' });
    } catch (e) {
      next(e);
    }
  };
}

export default AuthController;
