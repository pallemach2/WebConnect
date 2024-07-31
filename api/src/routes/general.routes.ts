// Custom imports
import Route from '../interfaces/route.interface';
import BaseRoutes from './base.routes';
import GeneralController from '../controllers/general.controller';

class GeneralRoutes extends BaseRoutes {
  static getPath() {
    return '/general';
  }

  static getRoutes() {
    const routes: Route[] = [
      {
        path: '/ping',
        method: 'get',
        protected: true,
        action: GeneralController.ping,
      },
    ];

    return routes;
  }
}

export default GeneralRoutes;
