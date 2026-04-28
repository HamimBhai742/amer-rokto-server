import { prisma } from "../../lib/prisma";
import AppError from "../../utils/app.erro";
import httpStatus from "http-status";

// ======================= BLOOD DONOR SERVICES =======================

const getBloodDonors = async (query: any) => {
  const { bloodGroup, district, upazila, isAvailable } = query;

  const filters: any = {
    role: "USER", // Assuming donors are regular users
  };

  if (bloodGroup) filters.bloodGroup = bloodGroup;
  if (district) filters.district = district;
  if (upazila) filters.upazila = upazila;
  if (isAvailable !== undefined) filters.isAvailable = isAvailable === "true";

  const donors = await prisma.user.findMany({
    where: filters,
    select: {
      id: true,
      name: true,
      email: true,
      bloodGroup: true,
      location: true,
      district: true,
      upazila: true,
      contact: true,
      gender: true,
      age: true,
      lastDonation: true,
      donationCount: true,
      isAvailable: true,
      weight: true,
      profileImage: true,
      rating: true,
    },
  });

  return donors;
};

const getBloodDonorDetails = async (donorId: string) => {
  const donor = await prisma.user.findUnique({
    where: { id: donorId },
    select: {
      id: true,
      name: true,
      email: true,
      bloodGroup: true,
      location: true,
      district: true,
      upazila: true,
      contact: true,
      gender: true,
      age: true,
      lastDonation: true,
      donationCount: true,
      isAvailable: true,
      weight: true,
      hasDisease: true,
      diseaseDetails: true,
      profileImage: true,
      rating: true,
    },
  });

  if (!donor) {
    throw new AppError(httpStatus.NOT_FOUND, "Blood donor not found");
  }

  return donor;
};

// ======================= BLOOD REQUEST SERVICES =======================

const createBloodRequest = async (requesterId: string, payload: any) => {
  const newRequest = await prisma.bloodRequest.create({
    data: {
      requesterId,
      ...payload,
    },
  });
  return newRequest;
};

const getAllBloodRequests = async (query: any) => {
  const { bloodGroup, urgency, district, status } = query;

  const filters: any = {};
  if (bloodGroup) filters.bloodGroup = bloodGroup;
  if (urgency) filters.urgency = urgency;
  if (district) filters.district = district;
  if (status) filters.status = status;

  const requests = await prisma.bloodRequest.findMany({
    where: filters,
    include: {
      requester: {
        select: {
          id: true,
          name: true,
          email: true,
          contact: true,
        },
      },
      donor: {
        select: {
          id: true,
          name: true,
          email: true,
          contact: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return requests;
};

const getBloodRequestById = async (id: string) => {
  const request = await prisma.bloodRequest.findUnique({
    where: { id },
    include: {
      requester: {
        select: {
          id: true,
          name: true,
          email: true,
          contact: true,
        },
      },
      donor: {
        select: {
          id: true,
          name: true,
          email: true,
          contact: true,
        },
      },
    },
  });

  if (!request) {
    throw new AppError(httpStatus.NOT_FOUND, "Blood request not found");
  }

  return request;
};

const updateBloodRequest = async (id: string, requesterId: string, payload: any) => {
  // Check ownership
  const existingRequest = await prisma.bloodRequest.findUnique({ where: { id } });
  
  if (!existingRequest) {
    throw new AppError(httpStatus.NOT_FOUND, "Blood request not found");
  }
  
  if (existingRequest.requesterId !== requesterId) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to update this request");
  }

  const updatedRequest = await prisma.bloodRequest.update({
    where: { id },
    data: payload,
  });

  return updatedRequest;
};

const updateBloodRequestStatus = async (id: string, donorId: string, payload: { status: string }) => {
  const existingRequest = await prisma.bloodRequest.findUnique({ where: { id } });

  if (!existingRequest) {
    throw new AppError(httpStatus.NOT_FOUND, "Blood request not found");
  }

  if (payload.status === "ACCEPTED") {
    // Only available if pending
    if (existingRequest.status !== "PENDING") {
      throw new AppError(httpStatus.BAD_REQUEST, "Blood request is no longer available");
    }
    
    // Prevent requester from accepting their own request
    if (existingRequest.requesterId === donorId) {
      throw new AppError(httpStatus.BAD_REQUEST, "You cannot accept your own blood request");
    }

    return await prisma.bloodRequest.update({
      where: { id },
      data: {
        status: "ACCEPTED",
        donorId: donorId,
      },
    });
  }

  // Completing or cancelling
  // Either requester or accepted donor can complete it or cancel it
  const isRequester = existingRequest.requesterId === donorId;
  const isDonor = existingRequest.donorId === donorId;

  if (!isRequester && !isDonor) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to change the status of this request");
  }

  const result = await prisma.bloodRequest.update({
    where: { id },
    data: {
      status: payload.status as any,
    },
  });

  // If completed, maybe update the donor's donationCount and lastDonation date
  if (payload.status === "COMPLETED" && existingRequest.donorId && existingRequest.status !== "COMPLETED") {
    await prisma.user.update({
      where: { id: existingRequest.donorId },
      data: {
        donationCount: { increment: 1 },
        lastDonation: new Date(),
      },
    });
  }

  return result;
};

export const BloodServices = {
  getBloodDonors,
  getBloodDonorDetails,
  createBloodRequest,
  getAllBloodRequests,
  getBloodRequestById,
  updateBloodRequest,
  updateBloodRequestStatus,
};
