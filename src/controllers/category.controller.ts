import formidable from "formidable";
import cloudinary from "cloudinary";
import { NextFunction, Request, Response } from "express";

import { ErrorHandler } from "../utils/error-handler";
import { categoryModel } from "../models/product/category.model";
import { CatchAsyncError } from "../middleware/catch-async-error";

export const add_category = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const form = formidable();

      form.parse(req, async (err, fields: any, files: any) => {
        if (err) {
          return next(new ErrorHandler(404, err.message));
        }

        let { name } = fields;
        let { image } = files;

        if (!name || !image) {
          return next(
            new ErrorHandler(400, "Category name and image are required")
          );
        }

        // Convert `name` to string if it's not already
        name = Array.isArray(name) ? name[0] : name;
        name = name.trim();

        const slug = name.split(" ").join("-");

        // Convert `image` to the correct type if necessary
        const file_path = Array.isArray(image)
          ? image[0].filepath
          : image.filepath;

        const result = await cloudinary.v2.uploader.upload(file_path, {
          folder: "categories",
        });

        if (result) {
          const category = await categoryModel.create({
            name,
            slug,
            image: result.url,
          });
          return res.status(201).json({
            success: true,
            data: category,
          });
        } else {
          return next(
            new ErrorHandler(400, "Something went wrong, please try again")
          );
        }
      });
    } catch (error: any) {
      return next(new ErrorHandler(500, error.message));
    }
  }
);

export const get_categories = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await categoryModel.find({}).sort({ createdAt: -1 });

      const totalCategory = await categoryModel.find({}).countDocuments();

      return res.status(200).json({
        success: true,
        category: { totalCategory, categories },
      });
    } catch (error: any) {
      return next(new ErrorHandler(500, error.message));
    }
  }
);
