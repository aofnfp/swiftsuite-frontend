import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { verifyEmail } from "../api/authApi";
import gif from "../Images/gif.gif";

const Auth = () => {
  const navigate = useNavigate();
  const [myLoader, setMyLoader] = useState(false);
  const email = localStorage.getItem("emailForAuth");
  const sendOtpEndpoint = "https://service.swiftsuite.app/accounts/send-otp/";

  // Countdown state (30 seconds)
  const [timeLeft, setTimeLeft] = useState(30);
  const [isActive, setIsActive] = useState(true);

  // Countdown effect
  useEffect(() => {
    let timer;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  // Format time as mm:ss
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Handle Resend OTP
  const handleResendOtp = async () => {
    try {
      setIsActive(true);
      setTimeLeft(30); // Reset to 30 seconds
      
      // Show loading toast
      const toastId = toast.loading("Resending OTP...");

      const response = await fetch(sendOtpEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast.success("OTP has been resent to your email.", { id: toastId });
      } else {
        toast.error("Failed to resend OTP. Please try again.", { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error while resending OTP.");
    }
  };

  const formik = useFormik({
    initialValues: { otp: "" },
    validationSchema: yup.object({
      otp: yup.string().required("OTP is required"),
    }),
    onSubmit: async (values) => {
      setMyLoader(true);
      try {
        await verifyEmail(values.otp);

        toast.success("Email verified successfully! Redirecting to Sign In...", {
          style: { background: "#089451", color: "#fff" },
          duration: 4000,
        });
        setTimeout(() => {
          navigate("/signin");
        }, 4000);
      } catch (error) {
        setMyLoader(false);

        if (error.response?.data?.message) {
          toast.error("Invalid OTP");
          return;
        }
        if (error.response?.data?.otp) {
          toast.error(error.response.data.otp);
          return;
        }
        toast.error(
          "An internal server issue has occurred. Please contact customer service."
        );
      } finally {
        setMyLoader(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Toaster position="top-right" richColors />
      <section className="shadow-xl w-full sm:w-11/12 md:w-[400px] lg:w-1/3 p-6 sm:p-8 lg:p-6 rounded-lg bg-white">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-2xl font-bold text-gray-900">
            Verify Your Email
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            A one-time password has been sent to your email to verify your account
          </p>
        </div>

        {/* Email Display */}
        {email && (
          <div className="mb-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs sm:text-sm text-gray-700">
              <span className="font-semibold text-gray-900">Email:</span> {email}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-4 sm:space-y-5">
          {/* OTP Input Field */}
          <div className="relative">
            <label htmlFor="otp" className="block font-semibold text-sm sm:text-base text-gray-800 mb-2">
              Enter OTP
            </label>
            <div className="relative">
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                placeholder="000000"
                name="otp"
                value={formik.values.otp}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                maxLength="6"
                className={`border-2 w-full py-2 sm:py-2.5 ps-4 pr-10 text-sm sm:text-base rounded-lg transition-colors text-center tracking-widest font-mono ${
                  formik.touched.otp && formik.errors.otp
                    ? "border-red-500 focus:outline-red-500"
                    : "border-[#089451] focus:outline-[#089451]"
                }`}
              />
              {formik.touched.otp && !formik.errors.otp && formik.values.otp && (
                <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            {formik.touched.otp && formik.errors.otp && (
              <span className="text-red-500 text-xs sm:text-sm mt-1 block">
                {formik.errors.otp}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={myLoader}
            className="w-full bg-[#027840] hover:bg-[#076a41] disabled:bg-gray-400 disabled:cursor-not-allowed flex rounded-lg justify-center items-center text-white font-bold py-2.5 sm:py-3 mt-6 sm:mt-8 h-10 sm:h-[40px] transition-colors"
          >
            {myLoader ? (
              <img src={gif} alt="loading" className="w-5 sm:w-[25px]" />
            ) : (
              "Verify OTP"
            )}
          </button>

          {/* Resend OTP Button */}
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={isActive}
            className={`w-full py-2.5 sm:py-3 font-bold rounded-lg h-10 sm:h-[40px] transition-colors ${
              isActive
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-[#005D68] text-white hover:bg-[#004557]"
            }`}
          >
            {isActive ? `Resend OTP in ${formatTime(timeLeft)}` : "Resend OTP"}
          </button>
        </form>

        {/* How It Works */}
        <div className="mt-6 sm:mt-8 p-4 sm:p-5 bg-green-50 rounded-lg border border-green-200">
          <p className="text-xs sm:text-sm font-semibold text-gray-900 mb-3">How to verify:</p>
          <ol className="space-y-2 text-xs sm:text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="font-bold text-[#089451] min-w-fit">1.</span>
              <span>Check your email inbox for the OTP</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-[#089451] min-w-fit">2.</span>
              <span>Enter the 6-digit code in the field above</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-[#089451] min-w-fit">3.</span>
              <span>Click "Verify OTP" to confirm</span>
            </li>
          </ol>
        </div>

        {/* Important Notes */}
        <div className="mt-4 sm:mt-6 p-4 sm:p-5 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-xs sm:text-sm font-semibold text-gray-900 mb-2">Important:</p>
          <ul className="space-y-1.5 text-xs sm:text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold">•</span>
              <span>OTP expires in 24 hours</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold">•</span>
              <span>Check your spam folder if you don't see the email</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold">•</span>
              <span>Never share your OTP with anyone</span>
            </li>
          </ul>
        </div>

        {/* Support Link */}
        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-xs sm:text-sm text-gray-600">
            Didn't receive the OTP?{" "}
            <a
              href="/support"
              className="font-semibold text-[#089451] hover:text-[#076a41] transition-colors"
            >
              Contact support
            </a>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Auth;