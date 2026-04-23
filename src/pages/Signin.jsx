import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { IoEyeSharp } from "react-icons/io5";
import { BsEyeSlashFill } from "react-icons/bs";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { useDispatch } from "react-redux";
import { sendOtpEndpoint, signin } from "../api/authApi";
import { setPermissions } from "../redux/permissionSlice";
import signImage1 from "../Images/signup1.png";
import { useCatalogueStore } from "../stores/catalogueStore";
import { useInventoryPrefsStore } from "../stores/inventoryPrefs";
import { useProductStore } from "../stores/productStore";
import { useOrderStore } from "../stores/orderStore";
import { useEditVendorStore } from "../stores/editVendorStore";
import { useListingStore } from "../stores/listingStore";
import { useMarketplaceStore } from "../stores/marketplaceStore";
import { useVendorStore } from "../stores/VendorStore";

const SignIn = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [myLoader, setMyLoader] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validationSchema = useMemo(
    () =>
      yup.object({
        email: yup
          .string()
          .email("Invalid email format")
          .required("Email is required"),
        password: yup.string().required("Password is required"),
      }),
    [],
  );

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values) => {
      setMyLoader(true);
      try {
        const res = await signin(values, { timeout: 15000 });
        localStorage.clear();
        sessionStorage.clear();

        useCatalogueStore.persist.clearStorage();
        useInventoryPrefsStore.persist.clearStorage();
        useProductStore.persist.clearStorage();
        useOrderStore.persist.clearStorage();
        useEditVendorStore.persist.clearStorage();
        useListingStore.persist.clearStorage();
        useMarketplaceStore.persist.clearStorage();
        useVendorStore.persist.clearStorage();

        useCatalogueStore.getState().resetCatalogue();
        useInventoryPrefsStore.getState().resetInventoryPrefs();
        useProductStore.getState().resetProduct();
        useOrderStore.getState().resetOrder();
        useEditVendorStore.getState().resetEditVendorStore();
        useListingStore.getState().resetListing();
        useMarketplaceStore.getState().resetEbayStore();
        useMarketplaceStore.getState().resetWcStore();
        useVendorStore.getState().resetVendor();

        localStorage.setItem("token", res.access_token);
        localStorage.setItem("fullName", res.full_name);
        localStorage.setItem("userId", res.id);

        dispatch(
          setPermissions({ subscribed: res.subscribed, isAdmin: res.isAdmin }),
        );
        toast.success("✅ Sign in successful!");
        const redirect = localStorage.getItem("redirectAfterLogin");
        setTimeout(() => {
          if (redirect) {
            localStorage.removeItem("redirectAfterLogin");
            navigate(redirect);
          } else {
            navigate("/layout/home");
          }
        }, 1000);
      } catch (error) {
        setMyLoader(false);
        if (error.code === "ECONNABORTED") {
          toast.error("⚠️ Request timed out. Please try again.");
        } else if (!error.response) {
          toast.error("⚠️ Network error. Please check your connection.");
        } else if (error.response.status === 403) {
          const msg = error.response.data?.detail;
          if (
            msg ===
            "Account not verified, check your email for verification code"
          ) {
            try {
              const res = await axios.post(sendOtpEndpoint, {
                email: values.email,
              });
              toast.success("✅ OTP sent to your email!");
              localStorage.setItem("emailForAuth", values.email);
              navigate("/auth");
            } catch (error) {
              if (error?.response?.status === 404) {
                toast.success("✅ OTP sent to your email!");
                localStorage.setItem("emailForAuth", values.email);
                navigate("/auth");
                return;
              }
              toast.error("⚠️ Failed to send OTP. Please try again.");
            }
          } else {
            toast.error("❌ Invalid credentials.");
          }
        } else if (error.response.data?.email) {
          error.response.data.email.forEach((msg) => toast.error(`⚠️ ${msg}`));
        } else {
          toast.error(
            error.response.data?.detail || "⚠️ Server error. Try again.",
          );
        }
      }
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-right" />
      <section className="flex-grow grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 lg:px-10">
        <div className="px-10 flex justify-center items-center">
          <img
            src={signImage1}
            alt="Sign in illustration"
            className="w-full h-full max-h-[55vh] object-contain"
          />
        </div>
        <div className="lg:py-20 lg:px-28 md:px-14 px-4 flex flex-col justify-center">
          <h1 className="text-center font-semibold text-2xl text-[#027840] mb-2">
            Enter your sign-in details
          </h1>
          <form onSubmit={formik.handleSubmit}>
            <p className="text-[#027840] font-semibold text-xl my-4">Sign in</p>
            <div className="my-2 h-[80px]">
              <label>Email</label>
              <input
                type="text"
                name="email"
                placeholder="Jane1234"
                className="text-base focus:outline-[#027840] px-4 py-3 w-full border-[1.5px] mt-1 border-[#027840]"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <span className="text-red-500 my-1">{formik.errors.email}</span>
              )}
            </div>
            <div className="mt-5 relative h-[80px]">
              <label>Password</label>
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                autoComplete="off"
                className="text-base focus:outline-[#027840] border-[1.5px] border-[#027840] mt-1 py-3 ps-4 w-full"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password && (
                <span className="text-red-500 my-1">
                  {formik.errors.password}
                </span>
              )}
              <span
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute top-[47px] right-5 cursor-pointer"
              >
                {passwordVisible ? <IoEyeSharp /> : <BsEyeSlashFill />}
              </span>
            </div>
            <div className="flex justify-between my-5">
              <label className="flex gap-2 items-center text-sm">
                <input type="checkbox" className="accent-green-600 w-4 h-4" />
                Remember Me
              </label>
              <Link
                to="/forgotpassword"
                className="hover:text-[#027840] text-sm"
              >
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              disabled={myLoader}
              className="w-full bg-[#027840] flex justify-center items-center h-[40px] rounded text-white font-bold py-3 mt-5"
            >
              {myLoader ? (
                <div className="w-[25px] h-[25px] border-4 border-t-transparent border-white rounded-full animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
            <div className="flex justify-between my-4 text-sm">
              <span className="font-semibold">Don't have an account?</span>
              <Link
                to="/signup"
                className="font-bold text-[#027840] hover:text-black"
              >
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default SignIn;
