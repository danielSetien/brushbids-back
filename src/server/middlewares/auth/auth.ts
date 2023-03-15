import jwt from "jsonwebtoken";
import { type NextFunction, type Response } from "express";
import { CustomError } from "../../../CustomError/CustomError";
import { type CustomJwtPayload, type CustomRequest } from "../../../types";

export const auth = (req: CustomRequest, res: Response, next: NextFunction) => {
  if (!req.header("Authorization")) {
    const authenticationError = new CustomError(
      "Missing authorization header",
      401,
      "Authentication failure"
    );

    next(authenticationError);
    return;
  }

  if (!req.header("Authorization")?.includes("Bearer")) {
    const authorizationError = new CustomError(
      "Missing authorization header",
      401,
      "Authentication failure"
    );

    next(authorizationError);
    return;
  }

  const token = req.header("Authorization"?.replace(/^Bearers\s*/, ""));
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
