import { type NextFunction } from "express";
import { CustomError } from "../../../CustomError/CustomError.js";
import responses from "../../../utils/responses.js";

const handlePaintingErrors = (
  next: NextFunction,
  errorMessage = "Internal Server Error."
) => {
  const fetchPaintingError = new CustomError(
    errorMessage,
    responses.statusCode.internalServerError,
    "Internal Server Error."
  );

  next(fetchPaintingError);
};

export default handlePaintingErrors;
