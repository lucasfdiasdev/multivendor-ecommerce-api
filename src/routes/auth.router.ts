import express from "express";

import { admin_login, sellerRegister } from "../controllers/auth.controller";

export const authRouter = express.Router();

authRouter.post("/admin-login", admin_login);

// sellers
authRouter.post("/seller-register", sellerRegister);
