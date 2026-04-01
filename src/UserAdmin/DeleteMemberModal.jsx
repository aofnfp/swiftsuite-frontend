import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";
import { ThreeDots } from "react-loader-spinner";

const DeleteMemberModal = ({ isOpen, onClose, memberName, memberId, onDeleteSuccess }) => {
  const [loading, setLoading] = useState(false);
  if (!isOpen) return null;

  const handleDelete = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No token found. Please log in again.");
        return;
      }

      await axios.delete(
        `https://service.swiftsuite.app/accounts/delete-subaccount/${memberId}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(`${memberName}'s account was deleted successfully.`);

      if (onDeleteSuccess) onDeleteSuccess();

      setTimeout(onClose, 1200);
    } catch (error) {
      toast.error("Failed to delete member. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <Toaster position="top-right" />
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          className="relative bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-md z-10"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
        >
          <h2 className="text-lg font-bold mb-3 border-b">
            Delete {memberName}'s account?
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            {memberName}'s account will be permanently removed. This action cannot be undone.
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center min-w-[90px]"
            >
              {loading ? <ThreeDots height="20" width="40" color="#fff" /> : "Delete"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DeleteMemberModal;
