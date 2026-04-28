import { ErrorRequestHandler } from "express";
import httpStatus from "http-status";
import AppError from "../utils/app.erro";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // Default Error Configuration
  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let message = "Something went wrong!";
  let errorSources = [
    {
      path: "",
      message: "An unexpected error occurred",
    },
  ];

  // 1. Handling custom AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  }
  // 2. Handling Prisma Client Validation Errors
  else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Prisma Validation Error";
    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  }
  // 3. Handling Prisma Known Request Errors (e.g., Unique Constraint Violations)
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = httpStatus.CONFLICT;
      message = "Duplicate Entry Error";
      const target = (err.meta?.target as string[]) || [];
      errorSources = [
        {
          path: target.length ? target.join(",") : "",
          message: `The value provided already exists and must be unique.`,
        },
      ];
    } else {
      statusCode = httpStatus.BAD_REQUEST;
      message = "Prisma Request Error";
      errorSources = [
        {
          path: "",
          message: err.message,
        },
      ];
    }
  }
  // 4. Handling Zod Validation Error
  else if (err instanceof ZodError) {
    statusCode = httpStatus.BAD_REQUEST;
    // Map all Zod issue messages into a beautifully readable single sentence string
    message = err.issues.map((issue) => issue.message).join(". ");
    
    errorSources = err.issues.map((issue) => ({
      path: String(issue.path[issue.path.length - 1]),
      message: issue.message,
    }));
  }
  // 5. Handling Generic Built-in Error
  else if (err instanceof Error) {
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  }

  // Final structured response
  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    // Expose stack trace only when NOT in production
    stack: process.env.NODE_ENV === "development" ? err?.stack : null,
  });
};

export default globalErrorHandler;
