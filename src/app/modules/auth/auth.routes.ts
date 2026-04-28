import { Router } from "express";
import { authController } from "./auth.controller";
import validateRequest from "../../middleware/validateRequest";
import { AuthValidation } from "./auth.validation";

const router=Router()

router.post("/login", validateRequest(AuthValidation.loginValidationSchema), authController.loginUser)
router.post("/forgot-password", validateRequest(AuthValidation.forgotPasswordValidationSchema), authController.forgotPassword)
router.post("/verify-otp", validateRequest(AuthValidation.verifyOtpValidationSchema), authController.verifyOtp)
router.post("/reset-password", validateRequest(AuthValidation.resetPasswordValidationSchema), authController.resetPassword)

export const authRoutes=router