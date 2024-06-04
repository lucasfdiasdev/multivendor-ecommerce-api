import express from "express";

import { isAuthenticated } from "../middleware/auth";
import {
  add_product,
  get_all_products,
} from "../controllers/product.controller";

export const productRouter = express.Router();

productRouter.post("/:id/add-product", isAuthenticated, add_product);
productRouter.get("/get-all-products", isAuthenticated, get_all_products);
