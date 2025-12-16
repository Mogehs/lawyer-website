import { asyncHandler } from "../../middleware/asyncHandler.js";
import User from "./User.model.js";
import { customError } from "../../utils/customError.js";
import { otpTemplate } from "../../utils/emailTemplates/otpTemplate.js";
import { generateOtp } from "../../utils/generateOtp.js";
import sendMail from "../../utils/sendMail.js";
import { generateToken } from "../../utils/token.js";

export const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user)
        throw new customError("User not found", 404);
    const isMatch = await user.matchPassword(password);
    if (!isMatch)
        throw new customError("Invalid email or password");

    if (!user.isVerified)
        throw new customError('Please verify your account before logging in', 401);

    const token = generateToken({
        id: user._id,
        role: user.role
    });

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
        success: true,
        message: "Login Successfull",
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profilePic: user.profilePic,
            phone: user.phone,
            status: user.status
        }
    });
})

export const signupUser = asyncHandler(async (req, res) => {
    const { fullName, email, phone, password } = req.body;
    if (!fullName || !email || !password) {
        throw new customError('Please provide all required fields', 400);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new customError('User with this email already exist! Please try with another email');
    }

    const otp = generateOtp(6);
    const otpExpires = Date.now() + 10 * 60 * 1000;

    const user = await User.create({
        name: fullName, email, phone, password, otp, otpExpires
    })

    await sendMail({
        email: user.email,
        subject: 'Your Law Firm OTP Verification',
        text: otpTemplate({ name: user.name, otp })
    })

    res.status(201).json({
        message: "Signup Successfull", user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        },
    });
});

export const verifyOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        throw new customError('Email and otp required')
    }

    const user = await User.findOne({ email });
    if (!user)
        throw new customError('User not found', 404);

    if (user.isVerified)
        throw new customError('User already verified', 400)
    if (user.otp !== otp)
        throw new customError('Invalid or Expired otp')
    if (user.otpExpires < Date.now())
        throw new customError('Otp has expired', 400)

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = generateToken({ id: user._id, role: user.role });

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
        success: true,
        message: "Account Verified Successfully"
    });
})

export const logout = asyncHandler(async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? "none" : "lax"
    })
    res.status(200).json({
        success: true,
        message: "Logout successfull"
    })
})

export const myProfile = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user)
        throw new customError('User not found', 404)

    res.status(200).json({
        success: true,
        message: "Profile fetched successfully",
        user
    })
})

export const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
        throw new customError("All fields are required", 400);
    }

    if (newPassword !== confirmPassword) {
        throw new customError("New password and confirm password do not match", 400);
    }

    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
        throw new customError("User not found", 404);
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        throw new customError("Old password is incorrect", 400);
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
        success: true,
        message: "Password changed successfully",
    });
});