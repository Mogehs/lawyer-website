import dotenv from "dotenv";
dotenv.config();

import serverless from "serverless-http";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import routes from "./routes/index.js";
import fs from "fs";
import path from "path";

const app = express();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  "https://system-alkhaldilawfirm.com",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed for this origin: " + origin));
      }
    },
    credentials: true,
  })
);

app.get("/api-docs", (req, res) => {
  try {
    const docPath = path.join(process.cwd(), "src", "routes.md");
    if (fs.existsSync(docPath)) {
      const doc = fs.readFileSync(docPath, "utf-8");
      res.type("text/plain").send(doc);
    } else {
      res.status(404).send("API documentation not found");
    }
  } catch (error) {
    res.status(500).send("Error loading API documentation");
  }
});

app.use("/api", routes);

app.use(errorHandler);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "API is running" });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({ message: "Lawyer Website API", version: "1.0.0" });
});

// Database connection promise
let dbConnection = null;

const getDbConnection = async () => {
  if (dbConnection) {
    return dbConnection;
  }

  try {
    await connectDB();
    dbConnection = true;
    console.log("✅ Database connected in Lambda");
    return dbConnection;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error;
  }
};

// Wrap the Express app with serverless-http
const serverlessHandler = serverless(app, {
  binary: ["image/*", "application/pdf"],
});

// Export the handler with DB connection
export const handler = async (event, context) => {
  // Keep Lambda warm by reusing connections
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // Ensure database is connected
    await getDbConnection();

    // Handle the request
    return await serverlessHandler(event, context);
  } catch (error) {
    console.error("Lambda handler error:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: "Internal Server Error",
        message: error.message,
      }),
    };
  }
};

