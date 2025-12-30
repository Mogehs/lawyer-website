import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // You can call your API here
    toast.success("Password reset link sent to your email!");

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden 
                 bg-white"
    >
      <div className="absolute inset-0 opacity-10 select-none pointer-events-none 
                      flex items-center justify-center text-[120px] font-extrabold 
                      text-slate-700 tracking-widest">
        E!E!E@
      </div>

      <div className="relative bg-white/90 backdrop-blur-md p-10 rounded-2xl shadow-xl 
                      w-full max-w-md border border-slate-200">

        <h1 className="text-3xl font-extrabold text-center mb-3 text-[#0B1F3B]">
          Forgot Password
        </h1>

        <p className="text-center text-slate-600 mb-8 text-sm">
          Enter your email and we will send you a reset link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="block text-slate-600 font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-[#0B1F3B] rounded-xl bg-slate-50 
                         focus:outline-none focus:ring-2 focus:ring-[#0B1F3B] transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full text-white py-3 rounded-xl text-lg px-3  bg-[#0B1F3B] hover:bg-[#ffff] hover:text-[#0B1F3B]  hover:border-[#0B1F3B]  border transition font-medium shadow-md hover:shadow-lg"
          >
            Send Reset Link
          </button>

          <p className="text-center text-sm mt-4 text-[#A48C65]">
            <a href="/login" className="text-[#0B1F3B] hover:underline font-semibold">
              Back to Login
            </a>
          </p>

        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
