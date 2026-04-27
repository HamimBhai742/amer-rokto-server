import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import config from "../../../config";
import AppError from "../../utils/app.erro";
import httpStatus from "http-status";
import crypto from "crypto";
import { emailSender } from "../../utils/emailSender";
import { forgotPasswordTemplate } from "../../utils/emailTemplate/forgotPasswordTemplate";
import { resetSuccessTemplate } from "../../utils/emailTemplate/resetSuccessTemplate";

const loginUser = async (payload: { email: string; password: string }) => {
  // 1. Find user by email
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found.");
  }

  // 2. Verify Email Status
  // Prevent unverified accounts from logging in.
  if (!user.isVerified) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Your account is not verified. Please verify your OTP before logging in."
    );
  }

  // 3. Password Check
  const isPasswordMatched = await bcrypt.compare(payload.password, user.password);

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Incorrect password.");
  }

  // 4. Generate JWT Token
  const jwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(
    jwtPayload,
    config.jwt_access_secret as string,
    {
      expiresIn: config.jwt_access_expires_in,
    } as jwt.SignOptions
  );

  // 5. Omit secure database variables
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, otp, otpExpires, ...userWithoutSensitiveInfo } = user;

  return {
    user: userWithoutSensitiveInfo,
    accessToken,
  };
};

const forgotPassword = async (payload: { email: string }) => {
  // 1. Check user exists
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found with this email.");
  }

  // 2. Generate OTP and expiry
  const otp = crypto.randomInt(100000, 999999).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  // 3. Save into user directly
  const updatedUser = await prisma.user.update({
    where: { email: payload.email },
    data: {
      otp,
      otpExpires,
    },
  });

  // 4. Send email
  const otpEmailHtml = forgotPasswordTemplate(updatedUser.name, otp);

  await emailSender(
    updatedUser.email,
    "Amer Rokto Password Reset Request",
    otpEmailHtml
  );

  return null;
};

const resetPassword = async (payload: { resetToken: string; newPassword: string }) => {
  // 1. Verify JWT Reset Token
  let decodedData;
  try {
    decodedData = jwt.verify(
      payload.resetToken,
      config.jwt_reset_secret as string
    ) as jwt.JwtPayload;
  } catch (err) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Unauthorized! Your Reset Token has expired or is invalid."
    );
  }

  const email = decodedData.email;

  // 2. Find user securely bound to token
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User bounded to Reset Token not found.");
  }

  // 3. Hash newly typed password Securely
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(payload.newPassword, saltRounds);

  // 4. Safely Update user profile
  const updatedUser = await prisma.user.update({
    where: { email },
    data: {
      password: hashedPassword,
    },
  });

  // 5. Send Success Email safely to the resolved user
  const successEmailHtml = resetSuccessTemplate(updatedUser.name);
  await emailSender(
    updatedUser.email,
    "Your Amer Rokto Password Has Been Reset",
    successEmailHtml
  );

  return null;
};

const verifyOtp = async (payload: { email: string; otp: string }) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found.");
  }

  if (user.otp !== payload.otp) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid OTP provided.");
  }

  if (user.otpExpires && user.otpExpires < new Date()) {
    throw new AppError(httpStatus.BAD_REQUEST, "OTP has expired.");
  }

  // Clear OTP securely as it has been uniquely validated once
  await prisma.user.update({
    where: { email: payload.email },
    data: {
      otp: null,
      otpExpires: null,
      isVerified: true, // Implicitly verifies their email account 
    },
  });

  // Provision Temporary Reset Token properly scoped
  const resetToken = jwt.sign(
    { email: user.email },
    config.jwt_reset_secret as string,
    { expiresIn: config.jwt_reset_expires_in } as jwt.SignOptions
  );

  return { resetToken };
};

export const authServices = {
  loginUser,
  forgotPassword,
  verifyOtp,
  resetPassword
};
