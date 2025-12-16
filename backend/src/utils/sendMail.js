import nodemailer from "nodemailer";
import { customError } from "./customError.js";

const sendMail = async ({ email, subject, text }) => {
  try {
    // Create transporter inside the function to ensure env vars are loaded
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use Gmail service directly
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      timeout: 10000,
    });

    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME || "Lawyer Website"} <${
        process.env.EMAIL_FROM || process.env.EMAIL_USER
      }>`,
      to: email,
      subject: subject,
      html: text,
    };

    console.log(`📧 Attempting to send email to: ${email}`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully: ${info.messageId}`);
    return info;
  } catch (error) {
    console.log("❌ Error in sending mail:", error.message);
    throw new customError("Error in send mail", 500);
  }
};
export default sendMail;
