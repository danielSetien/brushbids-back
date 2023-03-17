import multer from "multer";
import crypto from "crypto";
import path from "path";

const multerConfig = {
  storage: multer.diskStorage({
    destination: "uploads",
    filename(req, file, callback) {
      const suffix = crypto.randomUUID();
      const extension = path.extname(file.originalname);
      const baseName = path.basename(file.originalname, extension);

      const filename = `${baseName}-${suffix}${extension}`;

      callback(null, filename);
    },
  }),
};

export const upload = multer({
  ...multerConfig,
  limits: {
    fileSize: 1024 * 1024 * 8,
  },
});
