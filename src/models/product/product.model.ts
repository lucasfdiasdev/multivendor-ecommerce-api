import mongoose, { Schema, Document, Model } from "mongoose";

// schema departaments
export interface IProduct extends Document {
  sellerId: mongoose.Schema.Types.ObjectId;
  product_name: string;
  product_price: number;
  product_brand: string;
  product_description: string;
  product_slug: string;
  product_stock: number;
  product_discount: string;
  departament: string;
  shopName: string;
  images: [string];
}

const productSchema = new Schema<IProduct>(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "seller",
    },
    product_name: {
      type: String,
      required: true,
    },
    departament: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    product_brand: {
      type: String,
      required: true,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_stock: {
      type: Number,
      required: true,
    },
    product_description: {
      type: String,
      required: true,
    },
    product_discount: {
      type: String,
      required: true,
    },
    shopName: {
      type: String,
      required: true,
    },
    product_slug: {
      type: String,
      required: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

productSchema.index(
  {
    product_name: "text",
    product_brand: "text",
    category: "text",
    product_description: "text",
  },
  {
    weights: {
      product_name: 5,
      product_brand: 5,
      category: 3,
      product_description: 2,
    },
  }
);

productSchema.index({ sellerId: 1, product_name: 1 }, { unique: true });

export const productModel: Model<IProduct> = mongoose.model(
  "Product",
  productSchema
);
