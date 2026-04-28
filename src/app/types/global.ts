export interface ILoginUserPayload {
  email: string;
  password: string;
}

export interface IForgotPasswordPayload {
  email: string;
}

export interface IResendOtpPayload {
  email: string;
}

export interface IResetPasswordPayload {
  resetToken: string;
  newPassword: string;
}

export interface IVerifyOtpPayload {
  email: string;
  otp: string;
}

export interface IUserRegisterPayload {
  name: string;
  email: string;
  password: string;
  bloodGroup?: string;
  location?: string;
  district?: string;
  upazila?: string;
  contact?: string;
  emergencyContact?: string;
  gender?: string;
  age?: number;
  dateOfBirth?: Date | string;
  lastDonation?: Date | string;
  weight?: number;
  hasDisease?: boolean;
  diseaseDetails?: string;
  profileImage?: string;
}

export interface IChangePasswordPayload {
  email: string;
  oldPassword: string;
  newPassword: string;
}

export interface IUserUpdatePayload extends Partial<IUserRegisterPayload> {
  email: string;
}
