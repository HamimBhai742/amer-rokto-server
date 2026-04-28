import { Router } from "express";
import { userController } from "./user.controller";
import { checkAuth } from "../../middleware/checkAuth";
import validateRequest from "../../middleware/validateRequest";
import { UserValidation } from "./user.validation";

const router=Router()

router.post("/register", validateRequest(UserValidation.userRegisterValidationSchema), userController.userRegister)    
router.post("/verify-otp", validateRequest(UserValidation.verifyOtpValidationSchema), userController.verifyOtp)
router.post("/resend-otp", validateRequest(UserValidation.resendOtpValidationSchema), userController.resendOtp)
router.post("/change-password", checkAuth("USER", "ADMIN"), validateRequest(UserValidation.changePasswordValidationSchema), userController.changePassword)

export const userRoutes=router