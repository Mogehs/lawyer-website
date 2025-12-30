import React, { useState } from "react";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { useLoginMutation } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setProfile } from "../authSlice";

const Login = () => {
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(formData).unwrap();
      console.log('Login response:', res);

      // Set profile in Redux and localStorage
      dispatch(setProfile(res?.user));

      toast.success(res?.message || "Welcome back! Login successful");

      const role = res?.user?.role;

      // Navigate based on role
      switch (role) {
        case "director":
          navigate("/director", { replace: true });
          break;
        case "secretary":
          navigate("/", { replace: true });
          break;
        case "approvingLawyer":
          navigate("/approvingLawyer", { replace: true });
          break;
        case "lawyer":
          navigate("/lawyer", { replace: true });
          break;
        case "accountant":
          navigate("/accountant", { replace: true });
          break;
        default:
          toast.warning("Unknown role. Please contact administrator");
          navigate("/login", { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(
        error?.data?.message || "Invalid credentials. Please try again"
      );
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-white"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 select-none pointer-events-none 
                      flex items-center justify-center text-[120px] font-extrabold 
                      text-slate-700 tracking-widest">
        E!E!E@
      </div>

      {/* Login Card */}
      <div className="relative bg-white backdrop-blur-md p-10 rounded-2xl shadow-xl 
                      w-full max-w-md border border-slate-200">

        <h1 className="text-3xl font-extrabold text-center mb-2 text-[#0B1F3B]">
          Welcome Back
        </h1>

        <p className="text-center text-[#494C52] mb-8 text-sm">
          Please login to your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-slate-600 font-medium mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0B1F3B] rounded-xl bg-[#ffff] text-black placeholder-[#494C52] border border-[#0B1F3B] transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-slate-600 font-medium mb-1"
            >
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0B1F3B] rounded-xl bg-[#ffff] text-black placeholder-[#494C52] border border-[#0B1F3B] transition-all"
              />

              {/* Icon Toggle */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-500 hover:text-[#A48C65] focus:outline-none"
              >
                {showPassword ? (
                  <FiEye className="w-5 h-5" />

                ) : (
                  <FiEyeOff className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* ⭐ ADDED: FORGOT PASSWORD LINK (Only addition) ⭐ */}
          <div className="text-right -mt-2">
            <a
              href="/forgot-password"
              className="text-[#0B1F3B] hover:underline text-sm font-medium"
            >
              Forgot Password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full text-[#0B1F3B] py-3 rounded-xl text-lg font-medium shadow-md transition-all ${isLoading
              ? "bg-[#494C52] text-white cursor-not-allowed"
              : "bg-white border border-[#0B1F3B] text-gray-800 hover:bg-[#0B1F3B] hover:text-white transition-all duration-200 hover:shadow-lg"
              }`}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          {/* Extra Links */}
          <div className="text-center text-sm mt-4 text-slate-600">
            <p>
              Don’t have an account?{" "}
              <a
                href="/signup"
                className="text-[#0B1F3B] hover:underline font-semibold"
              >
                Sign up
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
