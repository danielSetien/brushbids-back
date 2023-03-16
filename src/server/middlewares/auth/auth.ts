import jwt from "jsonwebtoken";
import { type NextFunction, type Response } from "express";
import { CustomError } from "../../../CustomError/CustomError.js";
import { type CustomJwtPayload, type CustomRequest } from "../../../types";

export const auth = (req: CustomRequest, res: Response, next: NextFunction) => {
  const authHeader = req.header("Authorization");

  const authenticationError = new CustomError(
    "Missing authorization header",
    401,
    "Authentication failure"
  );

  if (!authHeader) {
    next(authenticationError);

    return;
  }

  if (!authHeader.includes("Bearer")) {
    next(authenticationError);

    return;
  }

  const token = req.header("Authorization"?.replace(/^Bearer\s*/, ""));
  try {
    const { username } = jwt.verify(
      token!,
      process.env.JWT_SECRET!
    ) as CustomJwtPayload;

    req.username = username;
  } catch (error) {
    next(error.message);
  }

  next();
};

export default auth;
