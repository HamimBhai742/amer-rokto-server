import nodemailer from "nodemailer";
import config from "../../config";
import AppError from "./app.erro";
import httpStatus from "http-status"; 

export const emailSender = async (
  email: string,
  subject: string,
  html: string
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: config.node_env === "production", // Use secure in production
      auth: {
        user: config.email_sender,
        pass: config.email_pass,
      },
    });

    const info = await transporter.sendMail({
      from: `"Amer Rokto System" <${config.email_sender}>`, // sender address
      to: email, // receiver
      subject, // Subject line
      html, // html body
    });

    console.log("Mail sent ID: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email: ", error);
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR,"Failed to send OTP email.");
  }
};
