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

  // Countdown state (10 seconds)
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
      setTimeLeft(10); // Reset to 10 seconds
      toast.info("Resending OTP...", {
        style: { background: "#089451", color: "#fff" },
      });

      const response = await fetch(sendOtpEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast.success("OTP has been resent to your email.");
      } else {
        toast.error("Failed to resend OTP. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error while resending OTP.");
    }
  };


  const formik = useFormik({
    initialValues: { otp: "" },
    validationSchema: yup.object({
      otp: yup.string().required(
        <span className="flex">
          <span>Field is required</span>
        </span>
      ),
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
    }, 5000); 
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
    <div className="flex items-center justify-center h-[85vh]">
      <Toaster position="top-right" />
      <section className="shadow-xl lg:w-1/3 md:w-[400px] w-2/3 lg:p-6 p-4">
        <div>
          <h1 className="lg:text-xl text-sm font-semibold">
            Enter the OTP sent to your Email
          </h1>
          <p className="text-[#00000099]">
            A one-time password would be sent to your email to reset your password
          </p>
          <form onSubmit={formik.handleSubmit}>
            <div className="mt-5 relative h-[90px]">
              <label htmlFor="otp" className="lg:font-semibold">
                Enter OTP
              </label>
              <br />
              <input
                type="number"
                placeholder="******"
                name="otp"
                className="border rounded-[8px] border-[#089451] mt-1 py-2 focus:outline-none ps-4 w-full"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
              <span className="text-red-500 my-1">
                {formik.touched.otp && formik.errors.otp}
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#089451] flex rounded-[8px] justify-center items-center text-white font-bold py-3"
            >
              {myLoader ? (
                <img src={gif} alt="loading" className="w-[25px]" />
              ) : (
                "Submit"
              )}
            </button>

            {/* Resend OTP Button */}
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isActive}
              className={`w-full mt-3 py-3 font-bold rounded-[8px] ${
                isActive ? "bg-[#00000033] cursor-not-allowed" : "bg-[#005D68] text-white"
              }`}
            >
              {isActive ? `Resend in ${formatTime(timeLeft)}` : "Resend OTP"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Auth;
