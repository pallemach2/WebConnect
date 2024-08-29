// Custom imports
import Route from '@interfaces/route.interface';
import BaseRoutes from '@routes/base.routes';
import ChatController from '@controllers/chat.controller';
import MulterService from '@services/multer.service';

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
        path: '/:id/messages',
        method: 'get',
        protected: true,
        action: ChatController.getMessages,
      },
      {
        path: '/:id/messages/:page',
        method: 'get',
        protected: true,
        action: ChatController.getMessagesAfterCursor,
      },
      {
        path: '/:id/avatar',
        method: 'post',
        customMiddleware: MulterService.upload.single('file'),
        protected: true,
        action: ChatController.uploadAvatar,
      },
    ];

    return routes;
  }
}

export default ChatRoutes;
