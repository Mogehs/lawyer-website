import React, { useState } from "react";
import { toast } from "react-toastify";
import { useVerifyAccountMutation } from "../api/authApi";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyAccount = () => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [verifyAccount, { isLoading }] = useVerifyAccountMutation();
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state.email || '';

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (/^[0-9]?$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            if (value && index < otp.length - 1) {
                document.getElementById(`otp-${index + 1}`).focus();
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const enteredOtp = otp.join("");
        if (enteredOtp.length !== 6) {
            toast.error("Please enter the complete 6-digit OTP");
            return;
        }

        try {
            console.log("Verifying OTP:", enteredOtp);
            const res = await verifyAccount({ otp: enteredOtp, email }).unwrap();
            console.log(res);
            toast.success(res.data?.message || "Account verified successfully!");
            navigate("/login")
        } catch (error) {
            toast.error(error.data?.message || "Invalid OTP. Please try again");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">
                    Verify Your Account
                </h1>
                <p className="text-center text-gray-600 mb-6">
                    Enter the 6-digit OTP sent to your email
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* OTP Inputs */}
                    <div className="flex justify-center gap-3">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                id={`otp-${index}`}
                                type="text"
                                value={digit}
                                maxLength="1"
                                onChange={(e) => handleChange(e, index)}
                                className="w-12 h-12 text-center border rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        ))}
                    </div>

                    {/* Verify Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-2 text-white font-semibold rounded-lg transition-colors ${isLoading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-500 hover:bg-blue-600"
                            }`}
                    >
                        {isLoading ? "Verifying..." : "Verify OTP"}
                    </button>

                    {/* Resend Link */}
                    <p className="text-center text-sm text-gray-600">
                        Didn’t receive the code?{" "}
                        <button
                            type="button"
                            onClick={() => toast.info("OTP resent successfully!")}
                            className="text-blue-500 hover:underline font-medium"
                        >
                            Resend OTP
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default VerifyAccount;
