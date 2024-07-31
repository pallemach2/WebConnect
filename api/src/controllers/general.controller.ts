// Package imports
import { Response as Rs, NextFunction as Nx } from 'express';

// Custom imports
import Rq from '../interfaces/request.interface';

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
      res.json('pong.');
    } catch (e) {
      next(e);
    }
  };
}

export default GeneralController;
