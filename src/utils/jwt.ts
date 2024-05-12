import "dotenv/config";
import { Response } from "express";
import { IUserAdmin } from "../models/admin.model";

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure?: boolean;
}

export const sendToken = async (
  userAdmin: IUserAdmin,
  statusCode: number,
  res: Response
) => {
  const accessToken = userAdmin.SignAccessToken();
  const refreshToken = userAdmin.SignRefreshToken();

  const options: ITokenOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expira em 7 dias
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  };

  res.cookie("access_token", accessToken, options);
  res.cookie("refresh_token", refreshToken, options);

  res.status(statusCode).json({
    success: true,
    userAdmin,
    accessToken,
  });
};
