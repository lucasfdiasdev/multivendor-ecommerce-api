import express from "express";

import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
  getAllSellersInfo,
  getRole,
  getUser,
  getUserById,
} from "../controllers/user.controller";

export const userRouter = express.Router();

userRouter.get("/get-roles", isAuthenticated, getRole);
userRouter.get("/get-user/:id", isAuthenticated, getUserById);
userRouter.get("/get-user/:id/:role", isAuthenticated, getUser);
userRouter.get(
  "/get-all-sellers",
  isAuthenticated,
  authorizeRoles("owner"),
  getAllSellersInfo
);
