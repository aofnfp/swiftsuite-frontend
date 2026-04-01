import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const SuspendMemberModal = ({ isOpen, onClose, memberName, memberId, onSuspendSuccess }) => {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  if (!isOpen) return null;

  const handleSuspend = async () => {
    try {
      setLoading(true);

      if (!token) {
        toast.error("No token found. Please log in again.");
        return;
      }

      const res = await axios.post(
        `https://service.swiftsuite.app/accounts/subaccount-activation/${memberId}/`,
        { option: "deactivate" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Suspend member response:", res.data); // ✅ Log API response

      toast.success(`${memberName} has been suspended.`);

      if (onSuspendSuccess) onSuspendSuccess(res.data); // Pass entire response
      onClose();
    } catch (error) {
      console.error("Failed to suspend member:", error);
      toast.error(
        error.response?.data?.message || "Failed to suspend member. Try again."
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
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Content */}
        <motion.div
          className="relative bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-md z-10"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
        >
          <h2 className="text-lg font-bold text-gray-900 mb-3 border-b">
            <span className="font-semibold">Suspend {memberName}?</span>
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Are you sure you want to suspend{" "}
            <span className="font-semibold">{memberName}</span>'s account?
            This will temporarily restrict their access until reactivated.
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
              onClick={handleSuspend}
              disabled={loading}
              className="px-4 py-3 bg-[#00000099] text-white rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Suspending..." : "Suspend Member"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SuspendMemberModal;
