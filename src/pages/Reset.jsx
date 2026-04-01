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

  const endpoint = `https://service.swiftsuite.app/accounts/set_new_password/`

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
        const response = await resetPassword(uidb64, token, values.password, values.confirm_password);
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
    <div>
      <section className="flex items-center justify-center  h-[85vh]">
        <div className="shadow-xl lg:w-1/3 md:w-[400px] w-2/3 lg:p-6 p-4">
          <h1 className=" lg:text-2xl font-bold">Reset Account Password</h1>
          <p className="lg:text-xl font-semibold my-4">Enter a new Password</p>
          <form action="" className="" onSubmit={formik.handleSubmit}>
            <div className="mt-5 relative h-[83px]">
              <label htmlFor="" className="font-semibold">
                Password
              </label>
              <br />
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder=""
                autoComplete="off"
                name="password"
                className="border-2 focus:outline-[#089451]   border-[#089451] mt-1 py-2 ps-4 w-full"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
              <span
                onClick={() => togglePasswordVisibility("password")}
                className="absolute top-[41px] right-5"
              >
                {!passwordVisible ? <BsEyeSlashFill /> : <IoEyeSharp />}
              </span>
              <span className="text-red-500 my-1">
                {formik.touched.password && formik.errors.password}
              </span>
            </div>
            <div className="my-2 relative h-[83px]">
              <label htmlFor="" className="font-semibold mb-1">
                Confirm Password
              </label>
              <br />
              <input
                type={confirmVisible ? "text" : "password"}
                className="border-2 focus:outline-[#089451]   bg-white border-[#089451] py-2 px-4 w-full"
                name="confirm_password"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
              <span
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute top-[38px] right-5"
              >
                {!confirmVisible ? <BsEyeSlashFill /> : <IoEyeSharp />}
              </span>
              <span className="text-red-500 my-1">
                {formik.touched.confirm_password &&
                  formik.errors.confirm_password}
              </span>
            </div>
            <button
              type="submit"
              className="w-full bg-[#089451] flex justify-center items-center text-white font-bold py-3 mt-5 h-[40px]"
            >
              {myLoader ? (
                <img src={gif} alt="" className="w-[25px] " />
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        </div>
      </section>
      <Toaster position="top-right" />
    </div>
  );
};

export default Reset;
