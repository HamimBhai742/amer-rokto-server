import { prisma } from "../lib/prisma";

export const connectedDb = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected");
  } catch (error) {
        if (error instanceof Error) {
      console.error("Database connection failed", error.message);
    }
    process.exit(1);
  }
};