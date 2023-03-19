import { Router } from "express";
import {
  createPainting,
  deletePainting,
  getPaintingById,
  getPaintings,
} from "../../controllers/paintingControllers/paintingControllers.js";
import auth from "../../middlewares/auth/auth.js";
import { upload } from "../../middlewares/multer/index.js";

const paintingsRouter = Router();

paintingsRouter.get("/", getPaintings);

paintingsRouter.get("/:idPainting", getPaintingById);

paintingsRouter.delete("/:idPainting", auth, deletePainting);

paintingsRouter.post("/create/", auth, upload.single("image"), createPainting);

export default paintingsRouter;
