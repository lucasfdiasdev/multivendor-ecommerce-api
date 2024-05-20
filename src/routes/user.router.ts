import express from "express";

import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { getAllSellersInfo, getUserInfo } from "../controllers/user.controller";

export const userRouter = express.Router();

userRouter.get("/get-user/:id", isAuthenticated, getUserInfo);
userRouter.get(
  "/get-all-sellers",
  isAuthenticated,
  authorizeRoles("ADMIN"),
  getAllSellersInfo
);
