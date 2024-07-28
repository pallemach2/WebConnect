// Package imports
import { NextFunction, Response } from 'express';

// Custom imports
import Request from '../interfaces/request.interface';
import Log from '../helpers/Logger';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function errorMiddleware(err: Error, req: Request, res: Response, _: NextFunction) {
  let status: number = res.statusCode !== 200 ? res.statusCode : 500;

  if (err.message.startsWith('Error: Banned')) status = 401;

  let message: string = err.message || 'api.errors.somethingWentWrong';
  const { stack } = err;

  // build error response
  const errorResponse: { type: string; message: string; error: Error; stack?: string } = {
    type: err.name,
    message,
    error: err,
  };

  // add error stack to resxponse if not prod, add console log
  if (process.env.NODE_ENV !== 'production') {
    Log.error(this, `❌ ${status.toString()} - ${message}`, stack);
    errorResponse.stack = stack;
  }

  // send back to client
  res.status(status).json(errorResponse);
}

export default errorMiddleware;
