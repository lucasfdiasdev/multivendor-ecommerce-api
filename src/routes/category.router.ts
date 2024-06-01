import express from "express";
import {
  add_departament,
  get_category_by_id,
  get_all_departaments,
  add_category_to_departament,
  add_subcategory_to_category,
} from "../controllers/category.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

export const categoryRouter = express.Router();

categoryRouter.post(
  "/add-departament",
  isAuthenticated,
  authorizeRoles("owner"),
  add_departament
);
// Routes for adding categories and subcategories
categoryRouter.post(
  "/add-category-to-departament/:departamentId",
  isAuthenticated,
  authorizeRoles("owner"),
  add_category_to_departament
);
categoryRouter.post(
  "/add-subcategory-to-category/:categoryId",
  isAuthenticated,
  authorizeRoles("owner"),
  add_subcategory_to_category
);

categoryRouter.get(
  "/get-all-departaments",
  isAuthenticated,
  get_all_departaments
);
categoryRouter.get("/:id", isAuthenticated, get_category_by_id);
