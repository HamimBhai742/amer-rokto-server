export const resetSuccessTemplate = (name: string) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="background-color: #28a745; width: 60px; height: 60px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; color: white; font-size: 30px;">
          ✓
        </div>
      </div>
      <h2 style="color: #333; text-align: center;">Password Reset Successful</h2>
      <p style="color: #333; font-size: 16px;">Hello ${name},</p>
      <p style="color: #333; font-size: 16px;">This email is to confirm that the password for your Amer Rokto account has been successfully changed.</p>
      <p style="color: #666; font-size: 14px; background-color: #f8f9fa; padding: 15px; border-left: 4px solid #d11a2a;">
        If you did not perform this action, please contact our support team immediately to secure your account.
      </p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="color: #999; font-size: 12px; text-align: center;">Thank you for using Amer Rokto.</p>
    </div>
  `;
};
