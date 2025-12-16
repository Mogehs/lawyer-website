import { useState } from "react";
import { useSignupMutation } from "../api/authApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [signup, { isLoading, error }] = useSignupMutation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Format phone number - remove non-digits for WhatsApp compatibility
    if (name === "phone") {
      const cleaned = value.replace(/\D/g, "");
      setFormData({ ...formData, [name]: cleaned });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await signup(formData).unwrap();
      toast.success(res?.message || "Account created successfully! Please verify your email");
      navigate("/verify-account", { state: { email: formData.email } });
    } catch (error) {
      toast.error(error?.data?.message || "Signup failed. Please try again");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-gradient-to-r from-[#BCB083] to-[#A48C65]"
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-10 select-none pointer-events-none 
                    flex items-center justify-center text-[120px] font-extrabold 
                    text-[#494C52] tracking-widest"
      >
        E!E!E@
      </div>

      {/* Form Container */}
      <div
        className="relative bg-white backdrop-blur-md p-10 rounded-2xl shadow-xl 
                    w-full max-w-md border border-slate-200"
      >
        <h1 className="text-3xl font-extrabold text-center mb-2 text-[#b48c65]">
          Create Account
        </h1>

        <p className="text-center text-[#494C52] mb-8 text-sm">
          Join us to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label
              className="block text-[#494C52] font-medium"
              htmlFor="fullName"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#BCB083] rounded-xl bg-[#ffff] text-black placeholder-[#494C52] border border-[#BCB083] transition-all"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[#494C52] font-medium" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              className="w-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#BCB083] rounded-xl bg-[#ffff] text-black placeholder-[#494C52] border border-[#BCB083] transition-all"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[#494C52] font-medium" htmlFor="phone">
              Phone Number
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="97412345678 (without + sign)"
              className="w-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#BCB083] rounded-xl bg-[#ffff] text-black placeholder-[#494C52] border border-[#BCB083] transition-all"
              required
            />
            <p className="text-xs text-[#494C52] mt-1">
            Format: Country code + number (e.g., 97412345678 for Qatar)
            </p>
          </div>

          <div className="space-y-1">
            <label
              className="block text-[#494C52] font-medium"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#BCB083] rounded-xl bg-[#ffff] text-black placeholder-[#494C52] border border-[#BCB083] transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full text-[#A48C65] py-3 rounded-xl text-lg font-medium transition-all shadow-md ${
              isLoading
                ? "bg-[#494C52] text-white cursor-not-allowed"
                : "bg-white border border-[#A48C65] text-gray-800 hover:bg-[#A48C65] hover:text-white transition-all duration-200 hover:shadow-lg"
            }`}
          >
            {isLoading ? "Creating..." : "Sign Up"}
          </button>

          {error && (
            <p className="text-[#b48c65] text-center mt-2 text-sm">
              {error?.data?.message || "Something went wrong"}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Signup;
