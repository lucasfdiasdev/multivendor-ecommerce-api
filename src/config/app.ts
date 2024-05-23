import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import express, { NextFunction, Request, Response } from "express";

import { authRouter } from "../routes/auth.router";
import { userRouter } from "../routes/user.router";

export const app = express();

app.use(
  cors({
    credentials: true,
    allowedHeaders: ["content-type", "Authorization"],
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));

// routes api
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});
