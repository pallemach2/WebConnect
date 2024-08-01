// Custom imports
import Route from '@interfaces/route.interface';
import BaseRoutes from '@routes/base.routes';
import ChatController from '@controllers/chat.controller';

class ChatRoutes extends BaseRoutes {
  static getPath() {
    return '/chat';
  }

  static getRoutes() {
    const routes: Route[] = [
      {
        path: '/all',
        method: 'get',
        protected: true,
        action: ChatController.all,
      },
      {
        path: '/:id',
        method: 'get',
        protected: true,
        action: ChatController.get,
      },
      {
        path: '/:id/messages/:page',
        method: 'get',
        protected: true,
        action: ChatController.getMessages,
      },
    ];

    return routes;
  }
}

export default ChatRoutes;
