import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: Number(process.env.PORT) || 5000,
  database_url: process.env.DATABASE_URL as string,
  node_env: process.env.NODE_ENV,
  email_sender: process.env.EMAIL_SENDER,
  email_pass: process.env.EMAIL_PASS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET || "fallback_secret",
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN || "1d",
  jwt_reset_secret: process.env.JWT_RESET_SECRET || "fallback_reset_secret",
  jwt_reset_expires_in: process.env.JWT_RESET_EXPIRES_IN || "5m",
};