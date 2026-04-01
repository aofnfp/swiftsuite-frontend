import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { BsEyeFill } from "react-icons/bs";
import { HiEyeOff } from "react-icons/hi";

// ✅ Validation schema
const schema = yup.object().shape({
  password: yup.string().required("Old password is required"),
  new_password: yup
    .string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("new_password"), null], "Passwords must match")
    .required("Please confirm your new password"),
});

// ✅ Helper to always fetch the latest token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const Password = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // visibility states
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleChangePassword = async (data) => {
    try {
      setLoading(true);

      const response = await axios.post(
        "https://service.swiftsuite.app/accounts/change-password/",
        {
          password: data.password,
          new_password: data.new_password,
          confirm_password: data.confirm_password,
        },
        {
          headers: getAuthHeaders(), // ✅ Always up-to-date token
          timeout: 15000,
        }
      );

      toast.success("Password changed successfully!");
      setIsModalOpen(false);
      reset();
      console.log("Password changed:", response.data);
    } catch (error) {
      console.log(error);

      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.error === "Invalid password"
      ) {
        toast.error("Invalid password");
      } else if (!localStorage.getItem("token")) {
        toast.error("Authentication token not found");
      } else {
        toast.error("Error changing password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-5">
      <Toaster position="top-right" />
      <h1 className="font-bold text-[15px] my-3">Change Password</h1>
      <p className="text-[12px] mb-1">Update your account password securely</p>
      <button
        onClick={() => setIsModalOpen(true)}
        disabled={loading}
        className="bg-[#027840] text-white py-2 px-4 rounded-[8px]"
      >
        {loading ? "Please wait..." : "Change Password"}
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            onClick={() => {
              setIsModalOpen(false);
              reset();
            }}
          >
            <motion.div
              initial={{ y: "100vh", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100vh", opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 15 }}
              className="bg-white w-full max-w-md rounded-2xl p-6 shadow-lg"
              onClick={(e) => e.stopPropagation()} // prevent closing on inside click
            >
              <h2 className="text-lg font-semibold mb-4">
                Change Your Password
              </h2>

              <form
                onSubmit={handleSubmit(handleChangePassword)}
                className="space-y-4"
              >
                {/* Old Password */}
                <div>
                  <label className="block text-sm text-gray-500">
                    Old Password
                  </label>
                  <div className="relative">
                    <input
                      type={showOld ? "text" : "password"}
                      {...register("password")}
                      className="w-full border p-2 rounded-md pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOld(!showOld)}
                      className="absolute right-2 top-2 text-gray-500"
                    >
                      {showOld ? (
                        <HiEyeOff size={18} />
                      ) : (
                        <BsEyeFill size={18} />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm text-gray-500">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      {...register("new_password")}
                      className="w-full border p-2 rounded-md pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-2 top-2 text-gray-500"
                    >
                      {showNew ? (
                        <HiEyeOff size={18} />
                      ) : (
                        <BsEyeFill size={18} />
                      )}
                    </button>
                  </div>
                  {errors.new_password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.new_password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm text-gray-500">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      {...register("confirm_password")}
                      className="w-full border p-2 rounded-md pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-2 top-2 text-gray-500"
                    >
                      {showConfirm ? (
                        <HiEyeOff size={18} />
                      ) : (
                        <BsEyeFill size={18} />
                      )}
                    </button>
                  </div>
                  {errors.confirm_password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirm_password.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#027840] text-white py-2 rounded-lg"
                >
                  {loading ? "Updating..." : "Change Password"}
                </button>
              </form>

              {/* Footer */}
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    reset();
                  }}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Password;
