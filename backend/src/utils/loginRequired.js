import jwt from "jsonwebtoken";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { customError } from "../utils/customError.js";
import User from "../features/auth/User.model.js";

export const loginRequired = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        throw new customError("Login required", 401);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'shakeeldev');

        const user = await User.findById(decoded.id).select("-password");
        if (!user) throw new customError("User not found", 404);

        req.user = user;
        next();
    } catch (err) {
        console.error("JWT verify error:", err.message);
        throw new customError("Invalid or expired token", 401);
    }
});

