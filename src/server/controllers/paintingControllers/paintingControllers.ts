import { type NextFunction, type Request, type Response } from "express";
import { Painting } from "../../../database/models/PaintingSchema.js";
import { type CustomRequest } from "../../../types.js";
import responses from "../../../utils/responses.js";
import handlePaintingErrors from "../../middlewares/handlePaintingErrors/handlePaintingErrors.js";

export const getPaintings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const paintings = await Painting.find().exec();

    res.status(responses.statusCode.success).json({ paintings });
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

    res.status(responses.statusCode.success).json({ painting });
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
    await Painting.findByIdAndDelete(idPainting).exec();

    res.status(responses.statusCode.success).json({});
  } catch (error: unknown) {
    handlePaintingErrors(next, (error as Error).message);
  }
};

export const createPainting = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const newPainting = req.body;

    await Painting.create({ newPainting });

    res.status(responses.statusCode.created).json({ newPainting });
  } catch (error: unknown) {
    handlePaintingErrors(next, (error as Error).message);
  }
};
