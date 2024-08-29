// Package imports
import { randomUUID } from 'crypto';
import multer from 'multer';
import path from 'path';

class MulterService {
  static multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './src/public/avatar/');
    },
    filename: (req, file, cb) => {
      cb(null, randomUUID() + path.extname(file.originalname));
    },
  });

  static multerFilter = (req: any, file: any, cb: any) => {
    if (!file.originalname.match(/\.(jpg)$/)) {
      // upload only png and jpg format
      return cb(new Error('Please upload a .jpg'));
    }
    cb(null, true);
  };

  static upload = multer({
    storage: MulterService.multerStorage,
    fileFilter: MulterService.multerFilter,
  });
}

export default MulterService;
