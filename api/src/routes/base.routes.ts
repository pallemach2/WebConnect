// Package imports
import { NextFunction, Router, Request, Response } from 'express';

// Custom imports
import Route from '@interfaces/route.interface';
import protectionMiddleware from '@middleware/protection.middleware';

abstract class BaseRoutes {
  routes: Array<Route>;
  router: Router;
  path: string;

  // Attach all routes
  static getRouter() {
    const routes = this.getRoutes();
    const path = this.getPath();
    const router = Router();

    routes.forEach((route: Route) => {
      const fullPath = `${path}${route.path}`;
      const action = async (req: Request, res: Response, next: NextFunction) => {
        await route.action(req, res, next);
      };

      if (route.protected) {
        router[route.method](fullPath, protectionMiddleware, action);
      } else {
        router[route.method](fullPath, action);
      }
    });

    return router;
  }

  static getRoutes(): any {
    return [];
  }

  static getPath() {
    return '';
  }
}

export default BaseRoutes;
