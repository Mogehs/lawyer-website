import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import routes from "./routes/index.js";
// Remove whatsappScheduler import from here - we'll initialize it later
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
  const docPath = path.join(process.cwd(), "src", "routes.md");
  const doc = fs.readFileSync(docPath, "utf-8");
  res.type("text/plain").send(doc);
});

app.use("/api", routes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB()
  .then(async () => {
    // Import WhatsApp scheduler after environment is fully loaded
    const { default: whatsappScheduler } = await import(
      "./utils/whatsappScheduler.js"
    );

    // Initialize WhatsApp scheduler
    await whatsappScheduler.initialize();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`🚀 WhatsApp notifications system is ready`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB, server not started", err);
  });
