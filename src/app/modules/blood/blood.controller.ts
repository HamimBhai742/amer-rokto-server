import { Request, Response } from "express";
import { catchAsync } from "../../utils/catch.async";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { BloodServices } from "./blood.services";

const getBloodDonors = catchAsync(async (req: Request, res: Response) => {
  const result = await BloodServices.getBloodDonors(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blood donors retrieved successfully",
    data: result,
  });
});

const getBloodDonorDetails = catchAsync(async (req: Request, res: Response) => {
  const result = await BloodServices.getBloodDonorDetails(req.params.id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Donor details retrieved successfully",
    data: result,
  });
});

const createBloodRequest = catchAsync(async (req: Request, res: Response) => {
  const requesterId = req.user.userId;
  const result = await BloodServices.createBloodRequest(requesterId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Blood request created successfully",
    data: result,
  });
});

const getAllBloodRequests = catchAsync(async (req: Request, res: Response) => {
  const result = await BloodServices.getAllBloodRequests(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blood requests retrieved successfully",
    data: result,
  });
});

const getBloodRequestById = catchAsync(async (req: Request, res: Response) => {
  const result = await BloodServices.getBloodRequestById(req.params.id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blood request retrieved successfully",
    data: result,
  });
});

const updateBloodRequest = catchAsync(async (req: Request, res: Response) => {
  const requesterId = req.user.userId;
  const result = await BloodServices.updateBloodRequest(req.params.id as string, requesterId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blood request updated successfully",
    data: result,
  });
});

const updateBloodRequestStatus = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const result = await BloodServices.updateBloodRequestStatus(req.params.id as string, userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blood request status updated successfully",
    data: result,
  });
});

export const BloodController = {
  getBloodDonors,
  getBloodDonorDetails,
  createBloodRequest,
  getAllBloodRequests,
  getBloodRequestById,
  updateBloodRequest,
  updateBloodRequestStatus,
};
