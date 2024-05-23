import express from "express";

import {
  admin_login,
  sellerLogin,
  sellerRegister,
} from "../controllers/auth.controller";

export const authRouter = express.Router();

// admin
authRouter.post("/admin-login", admin_login);

// seller
authRouter.post("/seller-register", sellerRegister);
authRouter.post("/seller-login", sellerLogin);
