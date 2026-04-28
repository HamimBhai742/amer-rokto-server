import { catchAsync } from "../../utils/catch.async";
import { sendResponse } from "../../utils/sendResponse";
import { UserServices } from "./user.services";
import httpStatus   from "http-status";
import { Request, Response } from "express";

const  userRegister =catchAsync(async(req:Request,res:Response)=>{
    const result = await UserServices.userRegister(req.body);
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"User registered successfully",
        data:result
    })
})


const verifyOtp  = catchAsync(async(req :Request,res:Response)=>{
    const result = await UserServices.verifyOtp(req.body);
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"User verified successfully",
        data:result
    })
})


const resendOtp = catchAsync(async(req: Request, res:Response)=>{
    const result = await UserServices.resendOtp(req.body);
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"New OTP generated and sent to email successfully",
        data:result
    })
})

const changePassword = catchAsync(async(req: Request, res:Response)=>{
    const { oldPassword, newPassword } = req.body;
    const email = req.user.email;
    const result = await UserServices.changePassword({ email, oldPassword, newPassword });
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Password changed successfully",
        data:result
    })
})

export const userController = {
    userRegister,
    verifyOtp,
    resendOtp,
    changePassword
}