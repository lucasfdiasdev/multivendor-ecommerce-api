import express from "express";
import {
  add_category,
  get_categories,
} from "../controllers/category.controller";
import { isAuthenticated } from "../middleware/auth";

export const categoryRouter = express.Router();

categoryRouter.post("/add-category", isAuthenticated, add_category);
categoryRouter.get("/get-categories", isAuthenticated, get_categories);
