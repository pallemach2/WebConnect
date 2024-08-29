// Custom imports
import Route from '@interfaces/route.interface';
import BaseRoutes from '@routes/base.routes';
import GeneralController from '@controllers/general.controller';
import MulterService from '@services/multer.service';
import ChatController from '@controllers/chat.controller';

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
      {
        path: '/avatar',
        method: 'post',
        customMiddleware: MulterService.upload.single('file'),
        protected: true,
        action: ChatController.uploadAvatar,
      },
    ];

    return routes;
  }
}

export default GeneralRoutes;
