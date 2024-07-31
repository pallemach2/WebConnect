// Package imports
import { Request as expReq } from 'express';

// Custom imports
import Context from '@interfaces/context.interface';

interface Request extends expReq {
  ctx: Context;
}

export default Request;
