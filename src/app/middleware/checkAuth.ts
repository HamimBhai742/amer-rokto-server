import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import AppError from "../utils/app.erro";
import { catchAsync } from "../utils/catch.async";
import { prisma } from "../lib/prisma";

// Extend Express Request mapping safely globally
declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}

export const checkAuth = (...requiredRoles: string[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // 1. Check if the token is passed in headers
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    const token = authHeader.split(" ")[1];
    // 2. Validate token
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(
        token,
        config.jwt_access_secret as string
      ) as JwtPayload;
    } catch (error) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Invalid or Expired Token");
    }

    // 3. Verify if user actually still exists in database
    const user = await prisma.user.findUnique({
      where: {
        email: decoded.email,
      },
    });

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "This user is no longer found!");
    }

    // 4. Role Authorization Checking
    if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You do not have the required permissions to access this route"
      );
    }

    // 5. Append User to Request scope smoothly
    req.user = decoded;
    next();
  });
};
