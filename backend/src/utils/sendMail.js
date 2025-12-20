import nodemailer from "nodemailer";

const sendMail = async ({ email, subject, text }) => {
  // Validate email configuration
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("⚠️ Email configuration missing - skipping email notification");
    return { success: false, error: "Email not configured" };
  }

  try {
    // Create transporter inside the function to ensure env vars are loaded
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use Gmail service directly
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 15000, // 15 seconds
      greetingTimeout: 15000,
      socketTimeout: 30000, // 30 seconds
      pool: true, // Use connection pooling
      maxConnections: 5,
      rateDelta: 1000,
      rateLimit: 5,
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
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error in sending mail:", error.message);
    console.error("Error details:", {
      code: error.code,
      command: error.command,
      responseCode: error.responseCode,
    });

    // Return error instead of throwing to allow graceful degradation
    return {
      success: false,
      error: error.message,
      code: error.code
    };
  }
};

export default sendMail;
