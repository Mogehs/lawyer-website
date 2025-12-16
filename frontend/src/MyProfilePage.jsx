import { useState } from "react";
import {
  FaUserCircle,
  FaSignOutAlt,
  FaLock,
  FaTimes,
  FaCamera,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { selectUserProfile } from "./features/auth/authSlice";
import { useSelector } from "react-redux";

const MyProfilePage = () => {
  const user = useSelector(selectUserProfile);
  const profile = {
    name: user?.name,
    role: user?.role,
    email: user?.email,
    phone: user?.phone,
    profilePic: null,
  };

  const [showModal, setShowModal] = useState(false);
  const [profileImage, setProfileImage] = useState(profile.profilePic);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setProfileImage(imageURL);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">

      {/* CARD */}
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">

        {/* ❌ CLOSE PROFILE PAGE BUTTON */}
        <button
          onClick={() => window.history.back()} // OR: navigate("/dashboard")
          className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center 
                     bg-white rounded-full shadow hover:bg-gray-200 text-[#A48C65] 
                     hover:text-[#494C52] transition-all"
        >
          <FaTimes size={20} />
        </button>

        {/* HEADER */}
        <div className="h-40 bg-gradient-to-r from-[#bcb083b6] to-[#A48C65]"></div>

        {/* Profile Image */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2">
          <div className="relative">
            {profileImage ? (
              <img
                src={profileImage}
                className="w-28 h-28 rounded-full border-4 border-[#A48C65] shadow-xl object-cover"
                alt="profile"
              />
            ) : (
              <FaUserCircle className="w-28 h-28 text-gray-200 bg-gray-50 rounded-full border-4 border-[#A48C65] shadow-xl" />
            )}

            <label
              htmlFor="profile-upload"
              className="absolute bottom-1 right-1 bg-[#494C52] text-white p-2 rounded-full shadow-md cursor-pointer hover:bg-[#3b3f44] transition"
            >
              <FaCamera size={14} />
            </label>

            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
        </div>

        {/* DETAILS */}
        <div className="mt-14 px-6 pb-10 text-center">
          <h2 className="text-2xl font-bold text-[#494C52]">{profile.name}</h2>
          <p className="text-slate-600 font-medium text-sm mt-1">{profile.role}</p>

          <div className="mt-4 space-y-2 text-sm text-slate-600">
            <div className="flex justify-center gap-2 items-center">
              <FaEnvelope size={14} /> {profile.email}
            </div>
            <div className="flex justify-center gap-2 items-center">
              <FaPhone size={14} /> {profile.phone ? '':' Not Provided'}
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-8 flex flex-col gap-3 items-center">
            <button
              onClick={() => setShowModal(true)}
              className="bg-transparent border border-[#A48C65] text-[#A48C65] px-6 py-2 rounded-full shadow-md hover:bg-[#8B7A4B] transition hover:text-white"
            >
              Change Password
            </button>

            <button
              className="flex items-center gap-2 text-sm text-white font-medium bg-[#A48C65] px-6 py-2 rounded-full hover:bg-[#8B7A4B] transition"
            >
              <FaSignOutAlt size={14} /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* PASSWORD MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              {/* Close Modal */}
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
                onClick={() => setShowModal(false)}
              >
                <FaTimes size={18} />
              </button>

              <h2 className="text-xl font-semibold text-slate-700 mb-6 text-center">
                Change Password
              </h2>

              <form className="space-y-5">
                {[
                  { label: "Old Password", name: "currentPassword" },
                  { label: "New Password", name: "newPassword" },
                  { label: "Confirm New Password", name: "confirmPassword" },
                ].map((field, i) => (
                  <div key={i} className="relative">
                    <FaLock className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="password"
                      placeholder={field.label}
                      value={passwords[field.name]}
                      onChange={(e) =>
                        setPasswords({ ...passwords, [field.name]: e.target.value })
                      }
                      required
                      className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-slate-700 outline-none"
                    />
                  </div>
                ))}

                <button
                  type="submit"
                  className="w-full bg-slate-700 text-white py-2.5 rounded-lg font-medium shadow hover:bg-slate-800 transition"
                >
                  Save Changes
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyProfilePage;
