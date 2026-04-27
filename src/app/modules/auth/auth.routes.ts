import { Router } from "express";
import { authController } from "./auth.controller";

const router=Router()

router.post("/login",authController.loginUser)
router.post("/forgot-password", authController.forgotPassword)
router.post("/verify-otp", authController.verifyOtp)
router.post("/reset-password", authController.resetPassword)

export const authRoutes=router