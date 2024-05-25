import mongoose, { Model, Schema } from "mongoose";

export interface ICategory {
  name: string;
  image: string;
  slug: string;
}

const categorySchema: Schema<ICategory> = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

categorySchema.index({
  name: "text",
});

export const categoryModel: Model<ICategory> = mongoose.model(
  "category",
  categorySchema
);
