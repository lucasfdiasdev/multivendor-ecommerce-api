import "dotenv/config";
import { Response } from "express";
import { IUserAdmin } from "../models/admin.model";
import { IUserSeller } from "../models/seller.model";

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure?: boolean;
}

type UserType = IUserAdmin | IUserSeller;

export const sendToken = async (
  user: UserType,
  statusCode: number,
  res: Response
) => {
  const accessToken = user.SignAccessToken();
  const refreshToken = user.SignRefreshToken();

  const accessOptions: ITokenOptions = {
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Expira em 3 dias
    maxAge: 3 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  };

  const refreshOptions: ITokenOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expira em 7 dias
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  };

  res.cookie("access_token", accessToken, accessOptions);
  res.cookie("refresh_token", refreshToken, refreshOptions);

  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
  });
};
