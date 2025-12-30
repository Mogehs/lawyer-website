import { FaUser, FaEnvelope, FaPhone, FaLock, FaUserTag } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const UserForm = ({
  show,
  onClose,
  onSubmit,
  formData,
  setFormData,
  roles,
}) => {
  const { t } = useTranslation("teamviewmodel");

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[9999]">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200">
        <h3 className="text-2xl font-bold text-[#0B1F3B] mb-6 text-center">
          {t("userForm.title")}
        </h3>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="relative">
            <FaUser className="absolute top-3 left-3 text-gray-400" />
            <input
              placeholder={t("userForm.fullName")}
              className="w-full pl-10 pr-3 py-2 border border-[#0B1F3B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3B] focus:border-[#0B1F3B] transition"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
            <input
              placeholder={t("userForm.email")}
              type="email"
              className="w-full pl-10 pr-3 py-2 border border-[#0B1F3B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3B] focus:border-[#0B1F3B] transition"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <FaPhone className="absolute top-3 left-3 text-gray-400" />
            <input
              placeholder={t("userForm.phone")}
              type="text"
              className="w-full pl-10 pr-3 py-2 border border-[#0B1F3B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3B] focus:border-[#0B1F3B] transition"
              value={formData.phone}
              onChange={(e) => {
                // Remove any non-digit characters
                const cleaned = e.target.value.replace(/\D/g, "");
                setFormData({ ...formData, phone: cleaned });
              }}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {t("userForm.phoneFormat")}
            </p>
          </div>

          {/* Role */}
          <div className="relative">
            <FaUserTag className="absolute top-3 left-3 text-gray-400" />
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full pl-10 pr-3 py-2 border border-[#0B1F3B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3B] focus:border-[#0B1F3B] transition"
            >
              {roles.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute top-3 left-3 text-gray-400" />
            <input
              type="password"
              placeholder={t("userForm.password")}
              className="w-full pl-10 pr-3 py-2 border border-[#0B1F3B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3B] focus:border-[#0B1F3B] transition"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <FaLock className="absolute top-3 left-3 text-gray-400" />
            <input
              type="password"
              placeholder={t("userForm.confirmPassword")}
              className="w-full pl-10 pr-3 py-2 border border-[#0B1F3B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3B] focus:border-[#0B1F3B] transition"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-[#0B1F3B] cursor-pointer text-white rounded-lg hover:bg-[#0B1F3B] transition"
            >
              {t("userForm.cancelButton")}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-white cursor-pointer border border-[#0B1F3B] text-gray-800 hover:bg-[#0B1F3B] hover:text-white transition-all duration-200 rounded-lg transition shadow-md"
            >
              {t("userForm.addButton")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
