// Custom imports
import Route from '@interfaces/route.interface';
import BaseRoutes from '@routes/base.routes';
import MessageController from '@controllers/message.controller';

class MessageRoutes extends BaseRoutes {
  static getPath() {
    return '/message';
  }

  static getRoutes() {
    const routes: Route[] = [
      {
        path: '/ping',
        method: 'get',
        protected: true,
        action: MessageController.ping,
      },
    ];

    return routes;
  }
}

export default MessageRoutes;
