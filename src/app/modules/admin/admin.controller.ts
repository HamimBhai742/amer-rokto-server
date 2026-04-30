import { Request, Response } from "express";
import { catchAsync } from "../../utils/catch.async";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { adminServices } from "./admin.services";

const getSystemStats = catchAsync(async (req: Request, res: Response) => {
  const result = await adminServices.getSystemStats();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "System statistics retrieved successfully",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await adminServices.getAllUsers(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieved successfully",
    data: result,
  });
});

const changeUserRole = catchAsync(async (req: Request, res: Response) => {
  const result = await adminServices.changeUserRole(req.params.id as string, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User role updated successfully",
    data: result,
  });
});

export const adminController = {
  getSystemStats,
  getAllUsers,
  changeUserRole,
};
