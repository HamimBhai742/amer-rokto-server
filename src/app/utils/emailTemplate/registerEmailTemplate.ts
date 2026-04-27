export const registerEmailTemplate = (name: string, otp: string) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
      <h2 style="color: #d11a2a; text-align: center;">Welcome to Amer Rokto!</h2>
      <p style="color: #333; font-size: 16px;">Hello ${name},</p>
      <p style="color: #333; font-size: 16px;">Thank you for registering with Amer Rokto. To complete your verification process, please use the following One-Time Password (OTP):</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="font-size: 32px; font-weight: bold; background-color: #f8f9fa; padding: 10px 20px; border-radius: 8px; letter-spacing: 5px; color: #d11a2a;">${otp}</span>
      </div>
      <p style="color: #666; font-size: 14px; text-align: center;">This OTP is valid for the next 10 minutes. Please do not share it with anyone.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="color: #999; font-size: 12px; text-align: center;">If you did not request this, please ignore this email.</p>
    </div>
  `;
};
