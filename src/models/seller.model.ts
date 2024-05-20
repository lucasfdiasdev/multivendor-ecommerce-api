import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";
import mongoose, { Model, Schema } from "mongoose";

export interface IUserSeller {
  name: string;
  email: string;
  password: string;
  status: string;
  role: string;
  method: string;
  imageUrl: string;
  shopInfo: {};
  payment: string;
  SignAccessToken: () => void;
  SignRefreshToken: () => void;
  comparePassword: (enteredPassword: string) => Promise<boolean>;
}

const userSellerSchema: Schema<IUserSeller> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "SELLER",
    },
    status: {
      type: String,
      default: "pending",
    },
    payment: {
      type: String,
      default: "inactive",
    },
    method: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    shopInfo: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

//sign access token
userSellerSchema.methods.SignAccessToken = function () {
  return jwt.sign(
    { id: this._id },
    (process.env.JWT_ACCESS_TOKEN as Secret) || "",
    {
      expiresIn: "3d",
    }
  );
};

// Middleware para hashear a senha antes de salvar
userSellerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//sign refresh token
userSellerSchema.methods.SignRefreshToken = function () {
  return jwt.sign(
    { id: this._id },
    (process.env.JWT_REFRESH_TOKEN as Secret) || "",
    {
      expiresIn: "7d",
    }
  );
};

// compare password before login
userSellerSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const userSellerModel: Model<IUserSeller> = mongoose.model(
  "Seller",
  userSellerSchema
);
