import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import config from "../../config";

export const seedAdmin = async () => {
  try {
    const isSuperAdminExists = await prisma.user.findFirst({
      where: {
        role: "ADMIN",
      },
    });

    if (!isSuperAdminExists) {
      const hashedPassword = await bcrypt.hash(
        config.admin_password as string,
        12
      );

      await prisma.user.create({
        data: {
          name: config.admin_name as string,
          email: config.admin_email as string,
          password: hashedPassword,
          role: "ADMIN",
          isVerified: true,
        },
      });

      console.log("🟢 Super Admin account locally seeded successfully into the database!");
    } else {
      console.log("🔵 Super Admin core already resides within the database.");
    }
  } catch (error) {
    console.error("🔴 Failed initializing Admin:", error);
  }
};
