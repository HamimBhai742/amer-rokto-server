import { Router } from "express";
import { userController } from "./user.controller";

const router=Router()

router.post("/register",userController.userRegister)    
router.post("/verify-otp",userController.verifyOtp)
router.post("/resend-otp",userController.resendOtp)

export const userRoutes=router