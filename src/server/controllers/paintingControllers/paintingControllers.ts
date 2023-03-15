import { type NextFunction, type Request, type Response } from "express";
import { Painting } from "../../../database/models/PaintingSchema.js";
import handlePaintingErrors from "../../middlewares/handlePaintingErrors/handlePaintingErrors.js";

export const getPaintings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const paintings = await Painting.find().exec();

    res.status(200).json({ paintings });
  } catch (error: unknown) {
    handlePaintingErrors(next, (error as Error).message);
  }
};

export const getPaintingById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { idPainting } = req.params;

  try {
    const painting = await Painting.findById(idPainting).exec();

    res.status(200).json({ painting });
  } catch (error: unknown) {
    handlePaintingErrors(next, (error as Error).message);
  }
};

export const deletePainting = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { idPainting } = req.params;

  try {
    await Painting.findByIdAndDelete(idPainting);

    res.status(200).json({});
  } catch (error: unknown) {
    handlePaintingErrors(next, (error as Error).message);
  }
};
