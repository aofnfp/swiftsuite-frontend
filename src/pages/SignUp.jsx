import React, { useState } from "react";
import signImage1 from "../Images/signupp.png";
import { IoEyeSharp } from "react-icons/io5";
import { BsEyeSlashFill } from "react-icons/bs";
import { useFormik } from "formik";
import * as yup from "yup";
import gif from "../Images/gif.gif";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { signup } from "../api/authApi";

const SignUp = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [myloader, setMyloader] = useState(false);

  const notify = () => toast("Sign up Successful!");

  let navigate = useNavigate();
  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setPasswordVisible(!passwordVisible);
    } else if (field === "confirm") {
      setConfirmVisible(!confirmVisible);
    }
  };
  let lower = new RegExp(`(?=.*[a-z])`);
  let upper = new RegExp(`(?=.*[A-Z])`);
  let number = new RegExp(`(?=.*[0-9])`);
  let length = new RegExp(`(?=.{8,})`);

  let formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      password2: "",
    },
    onSubmit: async (values) => {
      setMyloader(true);
      try {
        await signup(values);
        toast.success("User sign up successfully")
        setMyloader(false);
        notify();
        localStorage.setItem('emailForAuth', values.email)
        navigate("/auth");
      } catch (error) {
        setMyloader(false);
        if (error.response.data.email) {
          toast.error("email already exist, proceed to login");
        } else if(error.message) {
          toast.error(error.message);
        } else {
          toast.error("An internal server issue has occurred. Please contact customer service.");
        }
      }
    },
    validationSchema: yup.object({
      first_name: yup.string().required(
        <span className="flex">
          <span>Field is required</span>
        </span>
      ),
      last_name: yup.string().required(
        <span className="flex">
          <span>Field is required</span>
        </span>
      ),
      email: yup
        .string()
        .email("Invalid email format")
        .required(
          <span className="flex">
            <span>Field is required</span>
          </span>
        ),

      password: yup
        .string()
        .matches(lower, "Must include lowercase letter")
        .matches(upper, "Must include uppercase letter")
        .matches(number, "Must include a number")
        .matches(length, "Must not be less than 8 characters")
        .required("This field is required"),
      password2: yup
        .string()
        .required(
          <span className="flex">
            {" "}
            <span>Confirm your Password</span>
          </span>
        )
        .oneOf([yup.ref("password"), null], "Passwords do not match"),
    }),
  });
  return (
    <div>
      <Toaster position="top-right" />
      <section className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1">
        <div className="flex mt-20">
          <img
            src={signImage1}
            alt="Sign in illustration"
            className="w-full h-full  max-h-[80vh] object-contain"
          />
        </div>
        <div className="lg:py-20 py-0 flex flex-col  justify-center  lg:px-28 px-14 ">
          <h1 className="text-center font-bold text-2xl text-[#027840]">
            Create an Account
          </h1>
          <form action="" className="" onSubmit={formik.handleSubmit}>
            <p className="flex my-4 font-bold text-xl text-[#027840]">
              Sign Up
            </p>
            <div className=" h-[80px] my-3">
              <label htmlFor="" className="font-[400] my-1">
                Firstname
              </label>
              <br />
              <input
                type="text"
                placeholder="Jane"
                className="px-4 py-2 w-full border-[1.5px] mt-1 border-[#027840] focus:outline-[#027840]"
                name="first_name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
              <span className="text-red-500 my-1">
                {formik.touched.first_name && formik.errors.first_name}
              </span>
            </div>
            <div className="h-[80px] my-3">
              <label htmlFor="" className="font-[400] my-1">
                Lastname
              </label>
              <br />
              <input
                type="text"
                placeholder="Doe"
                className="px-4 py-2 w-full border-[1.5px] mt-1 border-[#027840] focus:outline-[#027840]"
                name="last_name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
              <span className="text-red-500 my-1">
                {formik.touched.last_name && formik.errors.last_name}
              </span>
            </div>
            <div className="h-[80px] my-3">
              <label htmlFor="Email" className="font-[400] my-1">
                Email
              </label>
              <br />
              <input
                type="email"
                placeholder="jane@gmail.com"
                className="px-4 py-2 w-full border-[1.5px] mt-1 border-[#027840]  focus:outline-[#027840]"
                name="email"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
              <span className="text-red-500 my-1">
                {formik.touched.email && formik.errors.email}
              </span>
            </div>
            <div className="h-[80px] relative my-3">
              <label htmlFor="" className="font-[400]">
                Password
              </label>
              <br />
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder=""
                autoComplete="off"
                className="border-[1.5px] mt-1 border-[#027840] py-2 px-4 w-full focus:outline-[#027840]"
                name="password"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
              <span className="text-red-500 my-1">
                {formik.touched.password && formik.errors.password}
              </span>
              <span
                onClick={() => togglePasswordVisibility("password")}
                className="absolute top-[42px] right-5"
              >
                {!passwordVisible ? <IoEyeSharp /> : <BsEyeSlashFill />}
              </span>
            </div>
            <div className="h-[80px] relative my-3">
              <label htmlFor="" className="font-[400]">
                Confirm Password
              </label>
              <br />
              <input
                type={confirmVisible ? "text" : "password"}
                placeholder=""
                className="border-[1.5px] bg-white border-[#027840] py-2 mt-1 px-4 w-full focus:outline-[#027840]"
                name="password2"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
              <span className="text-red-500 my-1">
                {formik.touched.password2 && formik.errors.password2}
              </span>
              <span
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute top-[42px] right-5"
              >
                {!confirmVisible ? <IoEyeSharp /> : <BsEyeSlashFill />}
              </span>
            </div>
            <button
              type="submit"
              className="w-full bg-[#027840] flex justify-center items-center h-[40px] rounded text-white font-bold py-3 mt-5 mb-10"
            >
              {myloader ? (
                <img src={gif} alt="" className="w-[25px] " />
              ) : (
                "Sign Up"
              )}
            </button>
          </form>
        </div>
      </section>
      <div></div>
    </div>
  );
};

export default SignUp;
