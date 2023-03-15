import { Router } from "express";
import {
  deletePainting,
  getPaintingById,
  getPaintings,
} from "../../controllers/paintingControllers/paintingControllers.js";

const paintingsRouter = Router();

paintingsRouter.get("/", getPaintings);

paintingsRouter.get("/:idPainting", getPaintingById);

paintingsRouter.delete("/:idPainting", deletePainting);

export default paintingsRouter;
