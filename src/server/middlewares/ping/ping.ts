import { type NextFunction, type Request, type Response } from "express";
import responses from "../../../utils/responses.js";

const ping = (req: Request, res: Response, next: NextFunction) => {
  res.status(responses.statusCode.success).json({ ping: "pong 🏓" });
};

export default ping;
