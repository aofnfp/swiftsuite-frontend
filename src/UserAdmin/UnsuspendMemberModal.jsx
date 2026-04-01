import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ThreeDots } from "react-loader-spinner";

const UnsuspendMemberModal = ({
  isOpen,
  onClose,
  memberName,
  memberId,
  onUnsuspendSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  if (!isOpen) return null;

  const handleUnsuspend = async () => {
    try {
      setLoading(true);

      if (!token) {
        toast.error("No token found. Please log in again.");
        return;
      }

      const res = await axios.post(
        `https://service.swiftsuite.app/accounts/subaccount-activation/${memberId}/`,
        { option: "activate" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(`${memberName} has been unsuspended.`);

      if (onUnsuspendSuccess) onUnsuspendSuccess(res.data);

      setTimeout(onClose, 800);
    } catch (error) {
      console.error("Failed to unsuspend member:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to unsuspend member. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          className="relative bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-md z-10"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
        >
          <h2 className="text-lg font-bold text-gray-900 mb-3 border-b">
            Unsuspend {memberName}?
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Are you sure you want to unsuspend{" "}
            <span className="font-semibold">{memberName}</span>'s account? They
            will regain full access immediately.
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 text-gray-700 border border-[#02784099] rounded-lg transition"
            >
              Cancel
            </button>
            <button
              onClick={handleUnsuspend}
              disabled={loading}
              className="px-4 py-3 bg-[#027840] text-white rounded-lg transition disabled:opacity-50 flex items-center justify-center min-w-[140px]"
            >
              {loading ? (
                <ThreeDots height="20" width="40" color="#fff" />
              ) : (
                "Unsuspend Member"
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UnsuspendMemberModal;
