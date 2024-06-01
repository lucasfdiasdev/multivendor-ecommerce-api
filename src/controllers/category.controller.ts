import formidable from "formidable";
import cloudinary from "cloudinary";
import { NextFunction, Request, Response } from "express";

import { ErrorHandler } from "../utils/error-handler";
import {
  categoryModel,
  departamentModel,
  subcategoryModel,
} from "../models/product/category.model";
import { CatchAsyncError } from "../middleware/catch-async-error";

export const add_departament = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const form = formidable();

      form.parse(req, async (err, fields: any, files: any) => {
        if (err) {
          return next(new ErrorHandler(404, err.message));
        }

        let { departament_name } = fields;
        let { departament_image } = files;

        if (!departament_name || !departament_image) {
          return next(
            new ErrorHandler(400, "Category name and image are required")
          );
        }

        departament_name = Array.isArray(departament_name)
          ? departament_name[0]
          : departament_name;
        departament_name = departament_name.trim();

        const existingDepartament = await departamentModel.findOne({
          departament_name,
        });
        if (existingDepartament) {
          return next(new ErrorHandler(400, "Nome da categoria já existe"));
        }

        // Remover acentos do nome do departamento
        const departament_slug = departament_name
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .split(" ")
          .join("-");

        // Convert `image` to the correct type if necessary
        const file_path = Array.isArray(departament_image)
          ? departament_image[0].filepath
          : departament_image.filepath;

        const result = await cloudinary.v2.uploader.upload(file_path, {
          folder: "categories",
        });

        if (result) {
          const departament = await departamentModel.create({
            departament_name,
            departament_slug,
            departament_image: result.url,
            categories: [],
          });

          return res.status(201).json({
            success: true,
            data: departament,
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

interface ICategoryRequest {
  category_name: string;
}

export const add_category_to_departament = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { departamentId } = req.params;
      const { category_name } = req.body as ICategoryRequest;

      if (!category_name) {
        return next(new ErrorHandler(400, "Category name is required"));
      }

      const departament = await departamentModel.findById(departamentId);
      if (!departament) {
        return next(new ErrorHandler(404, "Departamento não encontrado"));
      }

      // Verificar se a categoria já existe dentro do departamento
      const existingCategory = await categoryModel.findOne({
        category_name,
        _id: { $in: departament.categories },
      });
      if (existingCategory) {
        return next(
          new ErrorHandler(400, "Category already exists in department")
        );
      }

      const category_slug = category_name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .split(" ")
        .join("-");

      const newCategory = new categoryModel({
        category_name,
        category_slug,
        subcategories: [],
      });

      departament.categories.push(newCategory);
      await newCategory.save(); // Salvar a nova categoria
      await departament.save(); // Salvar o departamento atualizado

      res.status(201).json({
        success: true,
        data: newCategory,
      });
    } catch (error: any) {
      return next(new ErrorHandler(500, error.message));
    }
  }
);

interface ISubcategoryRequest {
  subcategory_name: string;
}

export const add_subcategory_to_category = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { categoryId } = req.params;
      const { subcategory_name } = req.body as ISubcategoryRequest;

      if (!subcategory_name) {
        return next(new ErrorHandler(400, "Subcategory name is required"));
      }

      const category = await categoryModel.findById(categoryId);
      if (!category) {
        return next(new ErrorHandler(404, "Categoria não encontrada"));
      }

      const subcategory_slug = subcategory_name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .split(" ")
        .join("-");

      const newSubcategory = new subcategoryModel({
        subcategory_name,
        subcategory_slug,
      });

      category.subcategories.push(newSubcategory);
      await newSubcategory.save(); // Salvar a nova subcategoria
      await category.save(); // Salvar a categoria atualizada

      res.status(201).json({
        success: true,
        data: newSubcategory,
      });
    } catch (error: any) {
      return next(new ErrorHandler(500, error.message));
    }
  }
);

export const get_all_departaments = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { searchValue } = req.query;

      let filter = {};
      if (typeof searchValue === "string" && searchValue.trim() !== "") {
        filter = { $text: { $search: searchValue.trim() } };
      }

      // Consultar todos os departamentos e preencher as categorias e subcategorias
      const departaments = await departamentModel
        .find(filter)
        .populate({
          path: "categories",
          populate: { path: "subcategories" },
        })
        .sort({ createdAt: -1 });

      const totalDepartament = await departamentModel.countDocuments(filter);

      return res.status(200).json({
        success: true,
        data: { totalDepartament, departaments },
      });
    } catch (error: any) {
      return next(new ErrorHandler(500, error.message));
    }
  }
);

export const get_category_by_id = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const category = await departamentModel.findById(id);

      if (!category) {
        return next(new ErrorHandler(404, "Categoria não encontrada"));
      }

      return res.status(200).json({
        success: true,
        data: category,
      });
    } catch (error: any) {
      return next(new ErrorHandler(500, error.message));
    }
  }
);
