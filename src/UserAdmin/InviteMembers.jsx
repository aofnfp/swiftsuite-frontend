import React, { useState, useEffect } from "react";
import { IoPersonAdd } from "react-icons/io5";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

const inputBase =
  "w-full border border-gray-300 rounded-lg px-3.5 py-2.5 bg-gray-50 text-gray-900 text-sm outline-none transition-all duration-200 focus:border-[#027840] focus:bg-white focus:ring-2 focus:ring-[#027840]/10 placeholder-gray-400";

const inputError =
  "w-full border border-red-400 rounded-lg px-3.5 py-2.5 bg-red-50 text-gray-900 text-sm outline-none transition-all duration-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 placeholder-gray-400";

const labelBase =
  "block mb-1.5 text-xs font-semibold uppercase tracking-widest text-gray-500";

const InviteMembers = ({ onBack }) => {
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        if (!token) { navigate("/signin"); return; }
        const response = await axios.get(
          "https://service.swiftsuite.app/accounts/dashboard-analytics/",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAnalytics(response.data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        toast.error("Failed to load account data.");
      }
    };
    fetchAnalytics();
  }, [token, navigate]);

  const generatePassword = (length = 12) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?";
    return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join("");
  };

  const schema = yup.object().shape({
    first_name: yup.string().required("First name is required"),
    last_name: yup.string().required("Last name is required"),
    email: yup.string().email("Invalid email format").required("Email is required"),
    phone: yup.string().required("Phone number is required").test(
      "is-valid-phone", "Invalid phone number",
      (value) => value ? isValidPhoneNumber(value) : false
    ),
    password: yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
  });

  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setValue("password", generatePassword(12));
  }, [setValue]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await axios.post(
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
      if (err.response?.data?.detail) toast.error(err.response.data.detail);
      else if (err.response?.data?.email) toast.error(err.response.data.email);
      else toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = isLoading || (analytics && analytics.subaccounts_left <= 0);

  return (
    <>
      <div className="max-w-3xl mx-auto mt-[4.2rem]">

        {/* Top Bar */}
        <div className="flex justify-between items-center mb-5">
          <p className="flex items-center gap-2 text-[#027840] font-bold text-sm tracking-wide uppercase">
            <IoPersonAdd size={16} />
            Create New Member Account
          </p>
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white hover:border-[#027840] hover:text-[#027840] text-gray-500 text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
            </svg>
            <span>Go Back</span>
          </button>
        </div>

        {/* Account Remaining Banner */}
        <div
          className={`mb-5 p-4 rounded-xl border-l-4 transition-all duration-300 ${
            analytics === null
              ? "bg-gray-50 border-l-gray-300 border border-gray-200"
              : analytics.subaccounts_left <= 0
              ? "bg-red-50 border-l-red-500 border border-red-200"
              : "bg-[#027840] border-l-[#025c33] border border-[#025c33]"
          }`}
        >
          {analytics === null ? (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
              <p className="text-sm text-gray-500">Loading account plan info...</p>
            </div>
          ) : (
            <p className={`text-sm font-medium ${analytics.subaccounts_left <= 0 ? "text-red-900" : "text-white"}`}>
              You can have a maximum of{" "}
              <span className="font-bold">{analytics.max_subaccounts}</span> users.{" "}
              <span className={`font-bold ${analytics.subaccounts_left <= 0 ? "text-red-600" : "text-white"}`}>
                {analytics.subaccounts_left <= 0 ? "No" : analytics.subaccounts_left}
              </span>{" "}
              user license{analytics.subaccounts_left !== 1 ? "s" : ""} remaining.
            </p>
          )}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)}>

            {/* Profile Section Header */}
            <div className="md:px-14 px-5 py-5 border-b border-gray-100 border-l-4 border-l-[#027840]">
              <h2 className="text-base font-bold text-gray-700 tracking-wide">Profile Settings</h2>
              <p className="text-xs text-gray-400 mt-0.5">Enter the new member's personal information</p>
            </div>

            <div className="py-7 md:px-14 px-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-x-16 gap-x-6 gap-y-6">

                {/* First Name */}
                <div>
                  <label className={labelBase}>First Name</label>
                  <input
                    {...register("first_name")}
                    type="text"
                    placeholder="John"
                    className={errors.first_name ? inputError : inputBase}
                  />
                  {errors.first_name && (
                    <small className="block mt-1.5 text-xs text-red-500">{errors.first_name.message}</small>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className={labelBase}>Last Name</label>
                  <input
                    {...register("last_name")}
                    type="text"
                    placeholder="Doe"
                    className={errors.last_name ? inputError : inputBase}
                  />
                  {errors.last_name && (
                    <small className="block mt-1.5 text-xs text-red-500">{errors.last_name.message}</small>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className={labelBase}>Email Address</label>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="john.doe@example.com"
                    className={errors.email ? inputError : inputBase}
                  />
                  {errors.email && (
                    <small className="block mt-1.5 text-xs text-red-500">{errors.email.message}</small>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className={labelBase}>Phone Number</label>
                  <div
                    className={`flex items-center gap-2 border rounded-lg px-3.5 py-2.5 bg-gray-50 transition-all duration-200
                      focus-within:border-[#027840] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#027840]/10
                      [&_.PhoneInputInput]:bg-transparent [&_.PhoneInputInput]:outline-none [&_.PhoneInputInput]:border-none
                      [&_.PhoneInputInput]:text-gray-900 [&_.PhoneInputInput]:text-sm [&_.PhoneInputInput]:w-full
                      [&_.PhoneInputInput]:placeholder-gray-400
                      [&_.PhoneInputCountrySelect]:bg-transparent [&_.PhoneInputCountrySelect]:outline-none
                      [&_.PhoneInputCountrySelect]:border-none [&_.PhoneInputCountrySelect]:text-gray-500
                      [&_.PhoneInputCountrySelect]:text-sm [&_.PhoneInputCountrySelect]:cursor-pointer
                      ${errors.phone ? "border-red-400 bg-red-50" : "border-gray-300"}`}
                  >
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <PhoneInput
                          {...field}
                          international
                          defaultCountry="US"
                          placeholder="Enter phone number"
                          className="w-full"
                        />
                      )}
                    />
                  </div>
                  {errors.phone && (
                    <small className="block mt-1.5 text-xs text-red-500">{errors.phone.message}</small>
                  )}
                </div>

              </div>
            </div>

            {/* Verification Section Header */}
            <div className="md:px-14 px-5 py-5 border-b border-gray-100 border-l-4 border-l-[#027840]">
              <h2 className="text-base font-bold text-gray-700 tracking-wide">Verification</h2>
              <p className="text-xs text-gray-400 mt-0.5">A secure password has been auto-generated for this account</p>
            </div>

            <div className="py-7 md:px-14 px-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-x-16 gap-x-6">
                <div>
                  <label className={labelBase}>Generated Password</label>
                  <input
                    {...register("password")}
                    type="text"
                    readOnly
                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 bg-gray-50 text-[#027840] text-sm font-mono tracking-wide outline-none cursor-not-allowed"
                  />
                  {errors.password && (
                    <small className="block mt-1.5 text-xs text-red-500">{errors.password.message}</small>
                  )}
                  <p className="text-xs text-gray-400 mt-2">Share this password with the new member securely.</p>
                </div>
              </div>
            </div>

            {/* Footer / Submit */}
            <div className="flex justify-center py-6 border-t border-gray-100 bg-gray-50">
              <button
                type="submit"
                disabled={isDisabled}
                className="flex items-center justify-center gap-2 bg-[#027840] text-white px-8 py-2.5 w-[220px] rounded-lg text-sm font-semibold tracking-wide border-2 border-[#027840] transition-all duration-200 hover:bg-white hover:text-[#027840] hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <ThreeDots height="20" width="28" color="currentColor" ariaLabel="loading" />
                ) : (
                  <>
                    <IoPersonAdd size={15} />
                    Create Account
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>

      <Toaster position="top-right" />
    </>
  );
};

export default InviteMembers;