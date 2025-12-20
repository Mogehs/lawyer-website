import dotenv from "dotenv";
dotenv.config();

import connectDB from "../config/db.js";
import whatsappScheduler from "../utils/whatsappScheduler.js";

/**
 * Lambda handler for scheduled WhatsApp notifications
 * This function is triggered by CloudWatch Events on a schedule
 */
export const handler = async (event, context) => {
  // Don't wait for empty event loop - allow Lambda to freeze after callback
  context.callbackWaitsForEmptyEventLoop = false;

  console.log("🚀 Starting WhatsApp scheduler Lambda function");

  try {
    // Connect to database
    await connectDB();
    console.log("✅ Database connected");

    // Initialize and run the WhatsApp scheduler
    await whatsappScheduler.initialize();
    console.log("✅ WhatsApp scheduler initialized and executed successfully");

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "WhatsApp scheduler executed successfully",
        timestamp: new Date().toISOString(),
      }),
    };
  } catch (error) {
    console.error("❌ WhatsApp scheduler error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "WhatsApp scheduler failed",
        error: error.message,
        timestamp: new Date().toISOString(),
      }),
    };
  }
};

