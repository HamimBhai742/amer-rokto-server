import { authServices } from "./auth.services";
import httpStatus from "http-status";
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catch.async";
import { sendResponse } from "../../utils/sendResponse";

const loginUser = catchAsync(async(req:Request,res:Response)=>{
    console.log(req.body)
    const result = await authServices.loginUser(req.body);
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"User logged in successfully",
        data:result
    })
})

const forgotPassword = catchAsync(async(req:Request,res:Response)=>{
    const result = await authServices.forgotPassword(req.body);
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Password reset OTP sent to email",
        data:result
    })
})

const verifyOtp = catchAsync(async(req:Request,res:Response)=>{
    const result = await authServices.verifyOtp(req.body);
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Given OTP is valid. You can safely proceed to reset password.",
        data:result
    })
})

const resetPassword = catchAsync(async(req:Request,res:Response)=>{
    const result = await authServices.resetPassword(req.body);
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Password successfully reset",
        data:result
    })
})

export const authController = {
    loginUser,
    forgotPassword,
    verifyOtp,
    resetPassword
}   