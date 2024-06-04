import formidable from "formidable";
import cloudinary from "cloudinary";
import { NextFunction, Request, Response } from "express";

import { ErrorHandler } from "../utils/error-handler";
import { productModel } from "../models/product/product.model";
import { CatchAsyncError } from "../middleware/catch-async-error";

export const add_product = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id: sellerId } = req.params;

    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields: any, files: any) => {
      if (err) {
        return next(new ErrorHandler(500, "Erro ao processar o formulário"));
      }

      const {
        shopName,
        product_name,
        product_stock,
        product_brand,
        product_price,
        product_discount,
        product_description,
        departament,
      } = fields;

      // Validação dos campos
      if (
        !product_name ||
        !product_stock ||
        !product_brand ||
        !product_discount ||
        !product_description ||
        !departament
      ) {
        return next(new ErrorHandler(400, "Todos os campos são obrigatórios"));
      }

      try {
        const product_slug = product_name[0]
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .split(" ")
          .join("-");

        let allImagesUrl: any[] = [];

        if (files.images) {
          const images = Array.isArray(files.images)
            ? files.images
            : [files.images];

          for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(
              images[i].filepath,
              {
                folder: "products",
              }
            );
            allImagesUrl.push(result.secure_url);
          }
        }

        const product = await productModel.create({
          sellerId,
          shopName: shopName[0],
          product_name: product_name[0],
          product_slug,
          images: allImagesUrl,
          departament: departament[0].trim(),
          product_brand: product_brand[0].trim(),
          product_stock: parseInt(product_stock[0], 10),
          product_price: parseInt(product_price[0], 10),
          product_discount: parseInt(product_discount[0], 10),
          product_description: product_description[0].trim(),
        });

        res.status(201).json({ success: true, data: product });
      } catch (uploadError) {
        console.error(uploadError);
        return next(new ErrorHandler(500, "Erro ao fazer upload das imagens"));
      }
    });
  }
);

export const get_all_products = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { searchValue } = req.query;

      let filter = {};
      if (typeof searchValue === "string" && searchValue.trim() !== "") {
        filter = { $text: { $search: searchValue.trim() } };
      }

      // Consultar todos os produtos e preencher as categorias e subcategorias
      const products = await productModel
        .find(filter)
        .populate({
          path: "departament",
          populate: { path: "categories" },
        })
        .sort({ createdAt: -1 });

      const totalProducts = await productModel.countDocuments(filter);

      return res.status(200).json({
        success: true,
        data: { totalProducts, products },
      });
    } catch (error) {
      return next(new ErrorHandler(500, "Erro ao fazer upload das imagens"));
    }
  }
);
