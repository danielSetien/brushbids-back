import express from "express";
import cors from "cors";
import morgan from "morgan";
import { notFoundError } from "./middlewares/notFoundError/notFoundError.js";
import { generalError } from "./middlewares/generalError/generalError.js";
import ping from "./middlewares/ping/ping.js";
import usersRouter from "./routers/user/userRouters.js";
import paintingsRouter from "./routers/paintingsRouters/paintingsRouters.js";

export const app = express();
app.disable("x-powered-by");

const localUrl = process.env.LOCAL_URL!;
const productionUrl = process.env.PRODUCTION_URL!;
const altProductionUrl = process.env.ALT_PRODUCTION_URL!

const allowedOrigins = [localUrl, productionUrl, altProductionUrl];

const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(cors(corsOptions));

app.use(morgan("dev"));

app.use(express.json());

app.get("/", ping);

app.use("/user", usersRouter);

app.use("/paintings", paintingsRouter);

app.use("/", notFoundError);
app.use("/", generalError);
