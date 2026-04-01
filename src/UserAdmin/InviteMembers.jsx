import React, { useState, useEffect } from "react";
import { IoPersonAdd } from "react-icons/io5";
import { LiaTimesSolid } from "react-icons/lia";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

const InviteMembers = ({ onBack }) => {
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const navigate = useNavigate();

  // Fetch analytics data on component mount
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        if (!token) {
          navigate("/signin");
          return;
        }
        const response = await axios.get(
          "https://service.swiftsuite.app/accounts/dashboard-analytics/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAnalytics(response.data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        toast.error("Failed to load account data.");
      }
    };

    fetchAnalytics();
  }, [token, navigate]);

  const generatePassword = (length = 10) => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?";
    return Array.from({ length }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("");
  };

  const schema = yup.object().shape({
    first_name: yup.string().required("First name is required"),
    last_name: yup.string().required("Last name is required"),
    email: yup.string().email("Invalid email format").required("Email is required"),
    phone: yup
      .string()
      .required("Phone number is required")
      .test("is-valid-phone", "Invalid phone number", (value) =>
        value ? isValidPhoneNumber(value) : false
      ),
    password: yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
  });

  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const newPassword = generatePassword(12);
    setValue("password", newPassword);
  }, [setValue]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://service.swiftsuite.app/accounts/create-subaccount/",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      toast.success("User created successfully!");
      navigate("/invite-success");
    } catch (err) {
      console.error(err);
      if (err.response?.data?.detail) {
        toast.error(err.response.data.detail);
      } else if (err.response?.data?.email) {
        toast.error(err.response.data.email);
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-[4.2rem]">
      <div className="flex justify-between">
        <p className="flex justify-center items-center gap-2 text-[#027840] font-bold">
          <IoPersonAdd /> Create New Member Account
        </p>
        <button
          onClick={onBack}
          className="flex justify-center items-center gap-2 text-[#027840] font-bold"
        >
          Esc <LiaTimesSolid />
        </button>
      </div>

      {/* Only this text waits for analytics */}
      <p className="my-2 text-[15px]">
  {analytics ? (
    <>
      You can have a maximum of <span className="font-bold">{analytics.max_subaccounts}</span> users in your account plan.{" "}
      <span className="font-bold">{analytics.subaccounts_left}</span> user license{analytics.subaccounts_left !== 1 ? "s" : ""} remaining
    </>
  ) : (
    "Loading account plan info..."
  )}
   </p>

      <div className="py-6 bg-white shadow-md rounded-[24px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2 className="text-xl font-semibold border-b pb-2 mb-6 text-gray-800 md:px-14 px-5">
            Profile Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-16 gap-6 mb-10 md:px-14 px-5">
            <div>
              <label className="block mb-1 text-[1.2rem] text-[#00000099] font-semibold">First Name</label>
              <input {...register("first_name")} type="text" className="w-full border rounded-md px-4 py-2 border-gray-300 bg-[#F9F9F9] outline-none focus:ring-0 focus:border-gray-300"/>
              {errors.first_name && <small className="text-red-600">{errors.first_name.message}</small>}
            </div>

            <div>
              <label className="block mb-1 text-[1.2rem] text-[#00000099] font-semibold">Last Name</label>
              <input {...register("last_name")} type="text" className="w-full border bg-[#F9F9F9] rounded-md px-4 py-2 border-gray-300 outline-none focus:ring-0 focus:border-gray-300"/>
              {errors.last_name && <small className="text-red-600">{errors.last_name.message}</small>}
            </div>

            <div>
              <label className="block mb-1 text-[1.2rem] text-[#00000099] font-semibold">Email</label>
              <input {...register("email")} type="email" className="w-full border bg-[#F9F9F9] rounded-md px-4 py-2 border-gray-300 outline-none focus:ring-0 focus:border-gray-300"/>
              {errors.email && <small className="text-red-600">{errors.email.message}</small>}
            </div>

            <div>
              <label className="block mb-1 text-[1.2rem] text-[#00000099] font-semibold">Phone Number</label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <PhoneInput {...field} international defaultCountry="US" placeholder="Enter phone number" className="w-full"/>
                )}
              />
              {errors.phone && <small className="text-red-600">{errors.phone.message}</small>}
            </div>
          </div>

          <h2 className="text-xl font-semibold border-b pb-2 mb-6 text-gray-800 md:px-14 px-5">Verification</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-16 gap-6 mb-10 md:px-14 px-5">
            <div>
              <label className="block mb-1 text-[1.2rem] text-[#00000099] font-semibold">Password</label>
              <input {...register("password")} type="text" className="w-full border bg-[#F9F9F9] text-[#02784066] rounded-md px-4 py-2 border-gray-300 outline-none focus:ring-0 focus:border-gray-300"/>
              {errors.password && <small className="text-red-600">{errors.password.message}</small>}
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isLoading || (analytics && analytics.subaccounts_left <= 0)}
              className={`flex items-center justify-center bg-green-700 text-white px-6 w-[254px] py-2 rounded-md hover:bg-green-800 transition ${isLoading || (analytics && analytics.subaccounts_left <= 0) ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {isLoading ? (
                <ThreeDots height="25" width="30" color="#fff" ariaLabel="loading"/>
              ) : (
                "Create"
              )}
            </button>
          </div>
        </form>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default InviteMembers;
