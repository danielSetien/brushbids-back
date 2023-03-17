import { type NextFunction, type Request, type Response } from "express";
import createDebug from "debug";
import { type CustomError } from "../../../CustomError/CustomError.js";
import responses from "../../../utils/responses.js";

export const debug = createDebug("brushbids-back:error");

export const generalError = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  debug(error.message);

  res
    .status(error.statusCode || responses.statusCode.internalServerError)
    .json({ error: error.publicMessage || "Something went wrong" });
};
