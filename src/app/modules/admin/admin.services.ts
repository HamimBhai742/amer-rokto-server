import { prisma } from "../../lib/prisma";
import AppError from "../../utils/app.erro";
import httpStatus from "http-status";

const getSystemStats = async () => {
  const totalUsers = await prisma.user.count();
  const totalDonors = await prisma.user.count({ where: { isAvailable: true, bloodGroup: { not: null } } });
  
  const totalRequests = await prisma.bloodRequest.count();
  const completedRequests = await prisma.bloodRequest.count({ where: { status: "COMPLETED" } });
  const pendingRequests = await prisma.bloodRequest.count({ where: { status: "PENDING" } });

  const recentRequests = await prisma.bloodRequest.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      requester: { select: { name: true, email: true } },
    },
  });

  return {
    overview: {
      totalUsers,
      totalDonors,
      totalRequests,
      completedRequests,
      pendingRequests,
    },
    recentRequests,
  };
};

const getAllUsers = async (query: any) => {
  const { role, district } = query;
  
  const filters: any = {};
  if (role) filters.role = role;
  if (district) filters.district = district;

  const users = await prisma.user.findMany({
    where: filters,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      bloodGroup: true,
      contact: true,
      district: true,
      isAvailable: true,
      donationCount: true,
      createdAt: true,
    },
  });

  return users;
};

const changeUserRole = async (userId: string, payload: { role: "USER" | "ADMIN" }) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { role: payload.role },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  return updatedUser;
};

export const adminServices = {
  getSystemStats,
  getAllUsers,
  changeUserRole,
};
