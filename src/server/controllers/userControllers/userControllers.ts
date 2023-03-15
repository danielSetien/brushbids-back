import "../../../loadEnvironments.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { type Response, type NextFunction } from "express";
import { type CustomLoginRequest } from "../../../types.js";
import { User } from "../../../database/models/UserSchema.js";
import { CustomError } from "../../../CustomError/CustomError.js";
import { handleLoginRejections } from "../../middlewares/handleLoginRejections/handleLoginRejections.js";
import responses from "../../../utils/responses.js";

export const loginUser = async (
  req: CustomLoginRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).exec();

    if (!user) {
      const reasonForRejection = "email";
      handleLoginRejections(reasonForRejection, next);

      return;
    }

    const loginSuccess = await bcrypt.compare(password, user.password);

    if (!loginSuccess) {
      const reasonForRejection = "password";
      handleLoginRejections(reasonForRejection, next);

      return;
    }

    const { username } = user;

    const jwtPayload = {
      username,
      id: user._id,
    };

    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET!, {
      expiresIn: "2d",
    });

    res.status(responses.success.statusCode).json({ token });
  } catch (error: unknown) {
    const thrownError = new CustomError(
      (error as Error).message,
      responses.internalServerError.statusCode,
      "Internal Server Error."
    );

    next(thrownError);
  }
};
