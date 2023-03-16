import { type NextFunction, type Request, type Response } from "express";
import responses from "../../../utils/responses.js";

const ping = (req: Request, res: Response, next: NextFunction) => {
  res.status(responses.success.statusCode).json({ ping: "pong 🏓" });
};

export default ping;
