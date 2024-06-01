import mongoose, { Schema, Document, Model } from "mongoose";

// schema subcategories
export interface ISubcategory extends Document {
  subcategory_name: string;
  subcategory_slug: string;
}

// schema categories
export interface ICategory extends Document {
  category_name: string;
  category_slug: string;
  subcategories: ISubcategory[];
}

// schema departaments
export interface IDepartament extends Document {
  departament_name: string;
  departament_image: string;
  departament_slug: string;
  categories: ICategory[];
}

const subcategorySchema = new Schema<ISubcategory>({
  subcategory_name: {
    type: String,
    required: true,
  },
  subcategory_slug: {
    type: String,
    lowercase: true,
  },
});

const categorySchema = new Schema<ICategory>({
  category_name: {
    type: String,
    required: true,
  },
  category_slug: {
    type: String,
    required: true,
    lowercase: true,
  },
  subcategories: [{ type: Schema.Types.ObjectId, ref: "Subcategory" }],
});

const departamentSchema = new Schema<IDepartament>(
  {
    departament_name: {
      type: String,
      required: true,
    },
    departament_image: {
      type: String,
      required: true,
    },
    departament_slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
  },
  { timestamps: true }
);

departamentSchema.index({
  departament_name: "text",
});

export const departamentModel: Model<IDepartament> = mongoose.model(
  "Departament",
  departamentSchema
);

export const categoryModel: Model<ICategory> = mongoose.model(
  "Category",
  categorySchema
);

export const subcategoryModel: Model<ISubcategory> = mongoose.model(
  "Subcategory",
  subcategorySchema
);
