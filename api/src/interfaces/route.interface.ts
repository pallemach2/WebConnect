// Package imports
import { RequestHandler } from 'express';

interface Route {
  path: string;
  method: 'post' | 'put' | 'delete' | 'get';
  action: RequestHandler;
  protected: boolean;
}

export default Route;
