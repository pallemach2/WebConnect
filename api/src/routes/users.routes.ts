// Custom imports
import Route from '@interfaces/route.interface';
import BaseRoutes from '@routes/base.routes';
import UsersController from '@controllers/users.controller';

class UsersRoutes extends BaseRoutes {
  static getPath() {
    return '/users';
  }

  static getRoutes() {
    const routes: Route[] = [
      {
        path: '/all',
        method: 'get',
        protected: true,
        action: UsersController.all,
      },
    ];

    return routes;
  }
}

export default UsersRoutes;
