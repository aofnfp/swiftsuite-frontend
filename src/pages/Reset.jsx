import React, { useState, useEffect } from "react";
import { IoEyeSharp } from "react-icons/io5";
import { BsEyeSlashFill } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import gif from "../Images/gif.gif";
import { Toaster, toast } from "sonner";
import { resetPassword } from "../api/authApi";

const Reset = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [myLoader, setMyLoader] = useState(false);

  const navigate = useNavigate();
  const { uidb64, token } = useParams();

  const endpoint = `https://service.swiftsuite.app/accounts/set_new_password/`;

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setPasswordVisible(!passwordVisible);
    } else {
      setConfirmVisible(!confirmVisible);
    }
  };

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

  const formik = useFormik({
    initialValues: {
      password: "",
      confirm_password: "",
    },
    validationSchema: yup.object({
      password: yup
        .string()
        .required("Field is required")
        .min(8, "Password must be at least 8 characters")
        .matches(passwordRegex, "Must include letters and numbers"),
      confirm_password: yup
        .string()
        .required("Confirm password")
        .oneOf([yup.ref("password"), null], "Passwords do not match"),
    }),
    onSubmit: async (values) => {
      setMyLoader(true);
      try {
        const response = await resetPassword(
          uidb64,
          token,
          values.password,
          values.confirm_password
        );
        toast.success(response.message || "Password reset successful!");
        setMyLoader(false);
        setTimeout(() => navigate("/passreg"), 1000);
      } catch (error) {
        toast.error("Invalid credentials, try again.");
      } finally {
        setMyLoader(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <section className="flex items-center justify-center w-full">
        <div className="shadow-xl w-full sm:w-11/12 md:w-[400px] lg:w-1/3 p-6 sm:p-8 lg:p-6 rounded-lg bg-white">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl lg:text-2xl font-bold text-gray-900">
              Reset Account Password
            </h1>
            <p className="text-sm sm:text-lg lg:text-lg font-semibold text-gray-700 my-3 sm:my-4">
              Enter a new Password
            </p>
          </div>

          {/* Form */}
          <form onSubmit={formik.handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Password Field */}
            <div className="relative">
              <label htmlFor="password" className="block font-semibold text-sm sm:text-base text-gray-800 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  name="password"
                  value={formik.values.password}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  className={`border-2 w-full mt-1 py-2 sm:py-2.5 ps-4 pr-10 text-sm sm:text-base rounded transition-colors ${
                    formik.touched.password && formik.errors.password
                      ? "border-red-500 focus:outline-red-500"
                      : "border-[#089451] focus:outline-[#089451]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("password")}
                  className="absolute top-1/2 transform -translate-y-1/2 right-3 sm:right-4 text-gray-600 hover:text-gray-800 cursor-pointer p-1"
                  tabIndex="-1"
                >
                  {!passwordVisible ? (
                    <BsEyeSlashFill className="text-lg sm:text-xl" />
                  ) : (
                    <IoEyeSharp className="text-lg sm:text-xl" />
                  )}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <span className="text-red-500 text-xs sm:text-sm mt-1 block">
                  {formik.errors.password}
                </span>
              )}
              {formik.touched.password &&
                !formik.errors.password &&
                formik.values.password && (
                  <span className="text-green-600 text-xs sm:text-sm mt-1 block flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Password meets requirements
                  </span>
                )}
            </div>

            {/* Confirm Password Field */}
            <div className="relative my-3 sm:my-4">
              <label
                htmlFor="confirm_password"
                className="block font-semibold text-sm sm:text-base text-gray-800 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirm_password"
                  type={confirmVisible ? "text" : "password"}
                  placeholder="Confirm password"
                  autoComplete="new-password"
                  className={`border-2 bg-white w-full py-2 sm:py-2.5 px-4 pr-10 text-sm sm:text-base rounded transition-colors ${
                    formik.touched.confirm_password &&
                    formik.errors.confirm_password
                      ? "border-red-500 focus:outline-red-500"
                      : "border-[#089451] focus:outline-[#089451]"
                  }`}
                  name="confirm_password"
                  value={formik.values.confirm_password}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="absolute top-1/2 transform -translate-y-1/2 right-3 sm:right-4 text-gray-600 hover:text-gray-800 cursor-pointer p-1"
                  tabIndex="-1"
                >
                  {!confirmVisible ? (
                    <BsEyeSlashFill className="text-lg sm:text-xl" />
                  ) : (
                    <IoEyeSharp className="text-lg sm:text-xl" />
                  )}
                </button>
              </div>
              {formik.touched.confirm_password &&
                formik.errors.confirm_password && (
                  <span className="text-red-500 text-xs sm:text-sm mt-1 block">
                    {formik.errors.confirm_password}
                  </span>
                )}
              {formik.touched.confirm_password &&
                !formik.errors.confirm_password &&
                formik.values.confirm_password && (
                  <span className="text-green-600 text-xs sm:text-sm mt-1 block flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Passwords match
                  </span>
                )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={myLoader}
              className="w-full bg-[#027840] hover:bg-[#01643b] disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center text-white font-bold py-2.5 sm:py-3 mt-6 sm:mt-8 h-10 sm:h-[40px] rounded transition-colors"
            >
              {myLoader ? (
                <img src={gif} alt="Loading" className="w-5 sm:w-[25px]" />
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          {/* Password Requirements */}
          <div className="mt-6 sm:mt-8 p-4 sm:p-5 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs sm:text-sm font-semibold text-gray-900 mb-3">
              Password Requirements:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-[#089451] font-bold mt-0.5">•</span>
                <span>At least 8 characters long</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#089451] font-bold mt-0.5">•</span>
                <span>Contains both letters and numbers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#089451] font-bold mt-0.5">•</span>
                <span>Can include special characters (@$!%*?&)</span>
              </li>
            </ul>
          </div>

          {/* Security Notice */}
          <div className="mt-4 sm:mt-6 p-4 sm:p-5 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">
              <span className="font-semibold text-gray-900">Remember your password?</span> Keep it somewhere safe and never share it with anyone.
            </p>
          </div>

          {/* Support Link */}
          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-xs sm:text-sm text-gray-600">
              Need help?{" "}
              <a
                href="/contact-us"
                className="font-semibold text-[#089451] hover:text-[#01643b] transition-colors"
              >
                Contact support
              </a>
            </p>
          </div>
        </div>
      </section>
      <Toaster position="top-right" />
    </div>
  );
};

export default Reset;