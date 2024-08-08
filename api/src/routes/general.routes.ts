// Custom imports
import Route from '@interfaces/route.interface';
import BaseRoutes from '@routes/base.routes';
import GeneralController from '@controllers/general.controller';

class GeneralRoutes extends BaseRoutes {
  static getPath() {
    return '/general';
  }

  static getRoutes() {
    const routes: Route[] = [
      {
        path: '/ping',
        method: 'get',
        protected: false,
        action: GeneralController.ping,
      },
    ];

    return routes;
  }
}

export default GeneralRoutes;
