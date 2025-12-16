import { asyncHandler } from "../../middleware/asyncHandler.js";
import { customError } from "../../utils/customError.js";
import AdminReminder from "./models/model.reminder.js";

// 1. Create New Reminder
export const createReminder = asyncHandler(async (req, res) => {
    const { caseName, stage, type, lawyer, target, date, description } = req.body;
    if (!caseName || !stage || !type || !target || !date) {
        throw new customError(
            "caseName, stage, type, target, and date are required",
            400
        );
    }
    const reminder = await AdminReminder.create({
        createdBy: req.user?._id,
        caseName,
        stage,
        type,
        lawyer,
        target,
        date,
        description,
    });
    return res.status(201).json({
        success: true,
        message: "Reminder created successfully",
        reminder,
    });
});

// 2. Get All Reminders (Super Admin Only)
export const getAllReminders = asyncHandler(async (req, res) => {
    let { page = 1, limit = 10, search = "", stage, type, target, isCompleted } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const query = {};
    if (search) {
        query.$or = [
            { caseName: { $regex: search, $options: "i" } },
            { lawyer: { $regex: search, $options: "i" } },
        ];
    }
    if (stage) query.stage = stage;
    if (type) query.type = type;
    if (target) query.target = target;
    if (isCompleted !== undefined) query.isCompleted = isCompleted === "true";
    const total = await AdminReminder.countDocuments(query);
    const reminders = await AdminReminder.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("createdBy", "name email");
    return res.status(200).json({
        success: true,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        count: reminders.length,
        reminders,
    });
});

// 4. Get Single Reminder
export const getSingleReminder = asyncHandler(async (req, res) => {
    const reminder = await AdminReminder.findById(req.params.id);
    if (!reminder) {
        throw new customError("Reminder not found", 404);
    }
    return res.status(200).json({
        success: true,
        reminder,
    });
});

// 5. Update Reminder
export const updateReminder = asyncHandler(async (req, res) => {
    const updates = req.body;
    const reminder = await AdminReminder.findByIdAndUpdate(
        req.params.id,
        updates,
        { new: true, runValidators: true }
    );
    if (!reminder) {
        throw new customError("Reminder not found", 404);
    }
    return res.status(200).json({
        success: true,
        message: "Reminder updated successfully",
        reminder,
    });
});

// 6. Mark Reminder as Completed
export const markCompleted = asyncHandler(async (req, res) => {
    const reminder = await AdminReminder.findById(req.params.id);
    if (!reminder) {
        throw new customError("Reminder not found", 404);
    }
    reminder.isCompleted = true;
    await reminder.save();
    return res.status(200).json({
        success: true,
        message: "Reminder marked as completed",
        reminder,
    });
});

// 7. Delete Reminder
export const deleteReminder = asyncHandler(async (req, res) => {
    const reminder = await AdminReminder.findById(req.params.id);
    if (!reminder) {
        throw new customError("Reminder not found", 404);
    }
    await reminder.deleteOne();
    return res.status(200).json({
        success: true,
        message: "Reminder deleted successfully",
    });
});
