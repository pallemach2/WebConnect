// Package imports
import { NextFunction, Response } from 'express';

// Custom imports
import Request from '@interfaces/request.interface';
import Log from '@helpers/Logger';
import { ValidationError } from 'yup';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function errorMiddleware(err: Error, req: Request, res: Response, _: NextFunction) {
  let status: number = res.statusCode !== 200 ? res.statusCode : 500;

  if (err.message.startsWith('Error: Banned')) status = 401;

  // let message: string = err.message || 'api.errors.somethingWentWrong';
  // const { stack } = err;

  // build error response
  const errorResponse: { name: string; message: string; field?: string } = {
    name: err.name,
    message: err.message,
  };

  // Append fieldname if error is a valdiation error
  if (err.name === 'ValidationError') {
    errorResponse.field = (err as ValidationError).path;
  }

  // add error stack to resxponse if not prod, add console log
  if (process.env.NODE_ENV !== 'production') {
    Log.error(this, `❌ ${status.toString()} - ${err.message}`, err.stack);
  }

  // send back to client
  res.status(status).json(errorResponse);
}

export default errorMiddleware;
