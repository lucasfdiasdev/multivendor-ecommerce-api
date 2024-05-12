import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";
import mongoose, { Model, Schema } from "mongoose";

export interface IUserAdmin {
  name: string;
  email: string;
  password: string;
  imageUrl: string;
  role: string;
  SignAccessToken: () => void;
  SignRefreshToken: () => void;
  comparePassword: (enteredPassword: string) => Promise<boolean>;
}

const userAdminSchema: Schema<IUserAdmin> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "ADMIN",
    },
  },
  { timestamps: true }
);

//sign access token
userAdminSchema.methods.SignAccessToken = function () {
  return jwt.sign(
    { id: this._id },
    (process.env.JWT_ACCESS_TOKEN as Secret) || "",
    {
      expiresIn: "3d",
    }
  );
};

//sign refresh token
userAdminSchema.methods.SignRefreshToken = function () {
  return jwt.sign(
    { id: this._id },
    (process.env.JWT_REFRESH_TOKEN as Secret) || "",
    {
      expiresIn: "7d",
    }
  );
};

// compare password before login
userAdminSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const userAdminModel: Model<IUserAdmin> = mongoose.model(
  "Admin",
  userAdminSchema
);
