// Custom imports
import Route from '@interfaces/route.interface';
import AuthController from '@controllers/auth.controller';
import BaseRoutes from '@routes/base.routes';

class AuthRoutes extends BaseRoutes {
  static getPath() {
    return '/auth';
  }

  static getRoutes() {
    const routes: Route[] = [
      {
        path: '/authenticate',
        method: 'post',
        protected: false,
        action: AuthController.authenticate,
      },
      {
        path: '/register',
        method: 'post',
        protected: false,
        action: AuthController.register,
      },
      {
        path: '/refresh',
        method: 'post',
        protected: false,
        action: AuthController.refresh,
      },
      {
        path: '/password/forgot',
        method: 'post',
        protected: false,
        action: AuthController.forgotPassword,
      },
      {
        path: '/password/forgot/change',
        method: 'post',
        protected: false,
        action: AuthController.forgotPasswordChange,
      },
    ];

    return routes;
  }
}

export default AuthRoutes;
