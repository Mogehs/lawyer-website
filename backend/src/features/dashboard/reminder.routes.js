import express from "express";
import {
  createReminder,
  deleteReminder,
  getAllReminders,
  getSingleReminder,
  markCompleted,
  updateReminder,
} from "./reminder.controller.js";

const router = express.Router();
router.post("/create-reminder", createReminder);
router.get("/get-all-reminders", getAllReminders);
router.get("/get-single-reminder/:id", getSingleReminder);
router.put("/update-reminder/:id", updateReminder);
router.put("/mark-completed/:id", markCompleted);
router.delete("/delete-reminder/:id", deleteReminder);

export default router;
