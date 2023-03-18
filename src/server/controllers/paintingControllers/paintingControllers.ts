import "../../../loadEnvironments.js";
import { type NextFunction, type Request, type Response } from "express";
import fs from "fs/promises";
import path from "path";
import sizeOf from "image-size";
import { Painting } from "../../../database/models/PaintingSchema.js";
import { type CustomRequest } from "../../../types.js";
import responses from "../../../utils/responses.js";
import handlePaintingErrors from "../../middlewares/handlePaintingErrors/handlePaintingErrors.js";
import supabase from "../../middlewares/imageBackup/imageBackup.js";

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
  const bucketName = process.env.SUPABASE_BUCKET!;
  const localStorageDirectory = process.env.LOCAL_STORAGE_DIRECTORY!;
  try {
    const newPainting = req.body;

    const imageName = req.file?.filename;

    const finalImageDimensions = {
      width: "",
      height: "",
    };

    if (imageName) {
      const image = await fs.readFile(
        path.join(localStorageDirectory, imageName)
      );

      const imageDimensions = sizeOf(image);

      finalImageDimensions.width = imageDimensions.width!.toString();
      finalImageDimensions.height = imageDimensions.height!.toString();

      await supabase.storage.from(bucketName).upload(imageName, image);
    }

    const {
      data: { publicUrl: imageUrl },
    } = supabase.storage.from(bucketName).getPublicUrl(imageName!);

    const image = imageUrl;

    const newDatabasePainting = {
      ...newPainting,
      image,
      width: finalImageDimensions.width,
      height: finalImageDimensions.height,
    };

    await Painting.create(newDatabasePainting);

    res
      .status(responses.statusCode.created)
      .json({ newPainting: newDatabasePainting });
  } catch (error: unknown) {
    handlePaintingErrors(next, (error as Error).message);
  }
};
