import Multer from "multer";
import path from 'path';
import {fileURLToPath} from 'url';
export const multer = Multer({
  storage: Multer.diskStorage({
    destination: function (req, file, callback) {
      const __filename = fileURLToPath(import.meta.url);
      console.log(__filename);
      const __dirname = path.dirname(__filename);
      callback(null, `${__dirname}/images`);
    },
    filename: function (req, file, callback) {
      console.log(file.fieldname,"******",file.originalname);
      callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});

