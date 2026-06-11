import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "../../lib/prisma";
import { emailSender } from "../../utils/emailSender";
import { registerEmailTemplate } from "../../utils/emailTemplate/registerEmailTemplate";
import jwt from "jsonwebtoken";
import AppError from "../../utils/app.erro";
import httpStatus from "http-status";
import config from "../../../config";
import {
  IChangePasswordPayload,
  IResendOtpPayload,
  IUserRegisterPayload,
  IUserProfileUpdatePayload,
  IVerifyOtpPayload,
} from "../../types/global";
import { Prisma } from "@prisma/client";

const parseProfileDate = (value: Date | string) => {
  if (value instanceof Date) {
    return value;
  }

  const isoDateMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const slashDateMatch = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);

  if (isoDateMatch) {
    const [, year, month, day] = isoDateMatch.map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  }

  if (slashDateMatch) {
    const [, month, day, year] = slashDateMatch.map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  }

  return new Date(value);
};

const normalizeUserDates = <T extends { dateOfBirth?: Date | string; lastDonation?: Date | string }>(
  payload: T
) => {
  return {
    ...payload,
    ...(payload.dateOfBirth !== undefined && {
      dateOfBirth: parseProfileDate(payload.dateOfBirth),
    }),
    ...(payload.lastDonation !== undefined && {
      lastDonation: parseProfileDate(payload.lastDonation),
    }),
  };
};

const userRegister = async (payload: IUserRegisterPayload) => {
  // 1. Check if user already exists
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });



  // 2. Hash the password
  // Standard salt rounds for bcrypt is 10-12.
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(payload.password, saltRounds);

  // 3. Generate a 6-digit secure OTP
  const otp = crypto.randomInt(100000, 999999).toString();
  
  // 4. Set OTP expiration time (e.g., 10 minutes from now)
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    if(isUserExist && !isUserExist.isVerified){
        const   updatedUser = await prisma.user.update({
            where: { email: payload.email },
            data: {
              otp,
              otpExpires,
            },
          });
   const { password, otp: generatedOtp, ...userWithoutSensitiveInfo } = updatedUser;

  // 7. Send the Verification Email
  const otpEmailHtml = registerEmailTemplate(payload.name, generatedOtp as string);

  await emailSender(
    userWithoutSensitiveInfo.email,
    "Your Amer Rokto Verification OTP",
    otpEmailHtml
  );

  return userWithoutSensitiveInfo;
  }

  if (isUserExist) {
    throw new Error("User already exists with this email address.");
  }

  // 5. Save the user to the database
  const createdUser = await prisma.user.create({
    data: {
      ...normalizeUserDates(payload),
      password: hashedPassword,
      otp,
      otpExpires,
      isVerified: false,
    },
  });

  // 6. Omit sensitive information from the returned user object
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, otp: generatedOtp, ...userWithoutSensitiveInfo } = createdUser;

  // 7. Send the Verification Email
  const otpEmailHtml = registerEmailTemplate(payload.name, generatedOtp as string);

  await emailSender(
    userWithoutSensitiveInfo.email,
    "Your Amer Rokto Verification OTP",
    otpEmailHtml
  );

  return userWithoutSensitiveInfo;
};

const verifyOtp = async (payload: IVerifyOtpPayload) => {
  // 1. Find user by email
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found.");
  }

  // 2. Prevent already verified users from verifying again
  if (user.isVerified) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is already verified.");
  }

  // 3. Match OTP
  if (user.otp !== payload.otp) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid OTP provided.");
  }

  // 4. Check OTP Expiry
  if (user.otpExpires && user.otpExpires < new Date()) {
    throw new AppError(httpStatus.BAD_REQUEST, "OTP has expired.");
  }

  // 5. Update user verification status and clear OTP
  const updatedUser = await prisma.user.update({
    where: { email: payload.email },
    data: {
      isVerified: true,
      otp: null,
      otpExpires: null,
    },
  });

  // 6. Generate JWT Access Token
  const jwtPayload = {
    userId: updatedUser.id,
    email: updatedUser.email,
    role: updatedUser.role,
  };

  const accessToken = jwt.sign(
    jwtPayload,
    config.jwt_access_secret as string,
    {
      expiresIn: config.jwt_access_expires_in,
    } as jwt.SignOptions
   );

  // 7. Remove sensitive fields before returning
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userWithoutSensitiveInfo } = updatedUser;

  return {
    user: userWithoutSensitiveInfo,
    accessToken,
  };
};

const resendOtp = async (payload: IResendOtpPayload) => {
  // 1. Find the user
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found with this email.");
  }

  // 2. Prevent verified users from receiving another OTP
  if (user.isVerified) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is already verified.");
  }

  // 3. Generate new OTP and Expiration
  const otp = crypto.randomInt(100000, 999999).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // 4. Update the user
  const updatedUser = await prisma.user.update({
    where: { email: payload.email },
    data: {
      otp,
      otpExpires,
    },
  });

  // 5. Build and send email
  const otpEmailHtml = registerEmailTemplate(updatedUser.name, otp);

  await emailSender(
    updatedUser.email,
    "Your New Amer Rokto Verification OTP",
    otpEmailHtml
  );

  // 6. Return response sans sensitive data
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, otp: _, ...userWithoutSensitiveInfo } = updatedUser;

  return userWithoutSensitiveInfo;
};  

const changePassword = async (payload: IChangePasswordPayload) => {
  // 1. Find the user
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found with this email.");
  }

  // 2. Check if old password matches
  const isPasswordMatched = await bcrypt.compare(
    payload.oldPassword,
    user.password
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Old password does not match.");
  }

  // 3. Hash new password
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(payload.newPassword, saltRounds);

  // 4. Update the user
  const updatedUser = await prisma.user.update({
    where: { email: payload.email },
    data: {
      password: hashedPassword,
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, otp: _, ...userWithoutSensitiveInfo } = updatedUser;
  return userWithoutSensitiveInfo;
};

const updateProfile = async (email: string, payload: IUserProfileUpdatePayload) => {
  // 1. Find the user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found with this email.");
  }

  const allowedFields: (keyof IUserProfileUpdatePayload)[] = [
    "name",
    "bloodGroup",
    "location",
    "district",
    "upazila",
    "contact",
    "emergencyContact",
    "gender",
    "age",
    "dateOfBirth",
    "lastDonation",
    "weight",
    "hasDisease",
    "diseaseDetails",
    "profileImage",
    "isAvailable",
    "isNotified",
  ];

  const updateData: Prisma.UserUpdateInput = {};

  allowedFields.forEach((field) => {
    const value = payload[field];

    if (value !== undefined) {
      if (field === "dateOfBirth" || field === "lastDonation") {
        (updateData as Record<string, unknown>)[field] = parseProfileDate(value as Date | string);
        return;
      }

      (updateData as Record<string, unknown>)[field] = value;
    }
  });

  // 2. Update the user
  const updatedUser = await prisma.user.update({
    where: { email },
    data: updateData,
  });

  // 3. Return response sans sensitive data
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, otp: _, ...userWithoutSensitiveInfo } = updatedUser;

  return userWithoutSensitiveInfo;
};

export const UserServices = {
  userRegister,
  verifyOtp,
  resendOtp,
  updateProfile,
  changePassword,
};
