import express from "express";
const router = express.Router();

import authRoutes from "../features/auth/auth.routes.js";
import secretaryRoutes from "../features/secretary/secretary.routes.js";
import lawyerRoutes from "../features/lawyer/lawyer.routes.js";
import directorRoutes from "../features/dashboard/director.routes.js";
import adminReminderRoutes from "../features/dashboard/reminder.routes.js";
import whatsappRoutes from "../features/whatsapp/whatsapp.routes.js";
import accountingRoutes from "../features/accounting/accounting.routes.js";
import uploadRoutes from "./upload.routes.js";

router.use("/auth", authRoutes);
router.use("/secretary", secretaryRoutes);
router.use("/lawyer", lawyerRoutes);
router.use("/director", directorRoutes);
router.use("/director", adminReminderRoutes);
router.use("/whatsapp", whatsappRoutes);
router.use("/accounting", accountingRoutes);
router.use("/upload", uploadRoutes);

export default router;
