import React, { useState } from "react";
import { ChangePassword } from "../api/auth-api";
import Swal from "sweetalert2";
import { KeyRound, Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";

const ChangePasswordadmin = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Allows "Enter" key to submit
    const { oldPassword, newPassword, confirmPassword } = formData;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return Swal.fire("Required", "Please fill in all security fields.", "warning");
    }
    if (newPassword !== confirmPassword) {
      return Swal.fire("Mismatch", "The new passwords do not match.", "error");
    }
    if (newPassword.length < 8) {
      return Swal.fire("Security", "Password must be at least 8 characters.", "info");
    }

    try {
      setLoading(true);
      const response = await ChangePassword({ oldPassword, newPassword });
      Swal.fire({
        icon: "success",
        title: "Password Updated",
        text: response.message || "Your admin credentials have been secured.",
        timer: 3000,
        showConfirmButton: false,
      });

      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      Swal.fire(
        "Update Failed",
        error.response?.data?.message || "Verify your old password and try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header Decor */}
        <div className="bg-green-900 p-6 text-center text-white">
          <div className="inline-flex p-3 bg-white/20 rounded-full mb-3">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-bold">Security Settings</h2>
          <p className="text-blue-100 text-sm mt-1">Update your administrative password</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* Old Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Current Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <Lock size={18} />
              </span>
              <input
                type={showPasswords.old ? "text" : "password"}
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
              <button
                type="button"
                onClick={() => toggleVisibility("old")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600"
              >
                {showPasswords.old ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* New Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <KeyRound size={18} />
              </span>
              <input
                type={showPasswords.new ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Min. 8 characters"
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
              <button
                type="button"
                onClick={() => toggleVisibility("new")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600"
              >
                {showPasswords.new ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm New Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <KeyRound size={18} />
              </span>
              <input
                type={showPasswords.confirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat new password"
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
              <button
                type="button"
                onClick={() => toggleVisibility("confirm")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600"
              >
                {showPasswords.confirm ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-bold text-white shadow-md transition transform active:scale-[0.98] ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-900 hover:bg-blue-700 hover:shadow-lg"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : (
              "Update Admin Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordadmin;