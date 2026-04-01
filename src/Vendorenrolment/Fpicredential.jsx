import React, { useState, useEffect } from "react";
import vendor, { handleNextStep, handlePreviousStep } from "../redux/vendor";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { IoEyeSharp } from "react-icons/io5";
import { BsEyeSlashFill } from "react-icons/bs";
import { Toaster, toast } from "sonner";
import { ThreeDots } from "react-loader-spinner";
import { fpiCredential } from "../api/authApi";

import { useVendorStore } from "../stores/VendorStore";
const Fpicredential = () => {
  const vendorName = useVendorStore((state) => state.vendorName);
  const vendorId = useVendorStore((state) => state.vendorId);
  const setVendorConnection = useVendorStore((state) => state.setVendorConnection);
  const nextStep = useVendorStore((state) => state.nextStep);
  const setCurrentStep = useVendorStore((state) => state.setCurrentStep);
  const vendor_name = vendorName;

  const store = useSelector((state) => state.vendor.vendorData);

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [dispatchCheck, setDispatchCheck] = useState(false);
  const [myLoader, setMyLoader] = useState(false);

  const createSchema = (vendorName) => {
    return yup.object().shape({
      host:
        vendorName.toLowerCase() === "rsr" ||
        vendorName.toLowerCase() === "fragrancex"
          ? yup.string().notRequired()
          : yup.string().required("Host is required"),
      ftp_username:
        vendorName.toLowerCase() === "rsr" ||
        vendorName.toLowerCase() === "fragrancex"
          ? yup.string().notRequired()
          : yup.string().required("FTP Username is required"),
      ftp_password:
        vendorName.toLowerCase() === "rsr" ||
        vendorName.toLowerCase() === "fragrancex"
          ? yup.string().notRequired()
          : yup.string().required("FTP Password is required"),
      Username:
        vendorName.toLowerCase() === "rsr"
          ? yup.string().required("Username is required")
          : yup.string().notRequired(),
      Password:
        vendorName.toLowerCase() === "rsr"
          ? yup.string().required("Password is required")
          : yup.string().notRequired(),
      name:
        vendorName.toLowerCase() === "rsr"
          ? yup.string().required("account name is required")
          : yup.string().notRequired(),
      POS:
        vendorName.toLowerCase() === "rsr"
          ? yup.string().required("POS is required")
          : yup.string().notRequired(),
      apiAccessId:
        vendorName.toLowerCase() === "fragrancex"
          ? yup.string().required("API Access ID is required")
          : yup.string().notRequired(),
      apiAccessKey:
        vendorName.toLowerCase() === "fragrancex"
          ? yup.string().required("API Access Key is required")
          : yup.string().notRequired(),
      vendor_name: yup.string().notRequired(),
    });
  };

  const Schema = createSchema((vendor_name || "").toLowerCase());

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(Schema),
    defaultValues: {
      vendor_name: vendor_name || "",
      name: "",
      apiAccessId: "",
      apiAccessKey: "",
    },
  });

  const togglePasswordVisibility = (field) => {
    if (field === "ftp_password" || field == "Password") {
      setConfirmVisible(!confirmVisible);
    }
  };

  const dispatch = useDispatch();
  const onSubmit = async (data) => {
    setMyLoader(true);

    const form = {
      ...store,
      ...data,
      vendor_name,
      vendor: vendorId,
      account_data: {
        ftp_username: data.ftp_username || null,
        ftp_password: data.ftp_password || null,
        host: data.host || null,
        POS: data.POS || null,
        apiAccessId: data.apiAccessId || null,
        apiAccessKey: data.apiAccessKey || null,
        Username: data.Username || null,
        Password: data.Password || null,
        name: data.name || null,
      },
    };

    // Build a clean payload by removing null/undefined/empty values
    const buildPayload = (obj) =>
      Object.fromEntries(
        Object.entries(obj).filter(
          ([_, value]) => value !== null && value !== undefined && value !== ""
        )
      );

    const payload = buildPayload({
      vendor: vendorId,
      ftp_username: form.account_data.ftp_username,
      ftp_password: form.account_data.ftp_password,
      host: form.account_data.host,
      apiAccessId: form.account_data.apiAccessId,
      apiAccessKey: form.account_data.apiAccessKey,
      Username: form.account_data.Username,
      Password: form.account_data.Password,
      POS: form.account_data.POS,
      name: form.account_data.name,
    });
    try {
      const response = await fpiCredential(payload);
      setVendorConnection(response.data);
      toast.success("Connection Successful!");
      setDispatchCheck(true);
      dispatch(handleNextStep(form));
      nextStep();
    } catch (error) {
      if (
        error.response?.status === 400 &&
        error.request?.withCredentials === false
      ) {
        toast.error("Invalid credentials!");
      } else if (error.response.data.error) {
        toast.error(error.response.data.error);
      }
    } finally {
      setMyLoader(false);
    }
  };

  useEffect(() => {
    if (store) {
      setValue("host", store.host);
      setValue("ftp_username", store.ftp_username);
    }
  }, [store, setValue]);

  const handlePrevious = () => {
    dispatch(handlePreviousStep());
    setCurrentStep(0);
  };
  return (
    <>
      <section>
        <h1 className="py-2 text-lg font-bold">FTP/API Credentials</h1>
        <div className="w-full px-4 md:px-1 mt-2">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vendor Name */}
              <div className="flex flex-col">
                <label className="font-semibold mb-1">Vendor Name:</label>
                <input
                  {...register("vendor_name")}
                  type="text"
                  disabled
                  value={vendor_name || ""}
                  className="border border-black rounded p-2 h-[40px] focus:outline-none"
                />
              </div>

              {/* Account Name */}
              <div className="flex flex-col">
                <label className="font-semibold mb-1">Account Name:</label>
                <input
                  {...register("name")}
                  type="text"
                  placeholder="Enter account name"
                  className={`border border-black rounded p-2 h-[40px] focus:outline-none ${
                    errors.name ? "border-red-500" : ""
                  }`}
                />
                {errors.name && (
                  <small className="text-red-600">{errors.name.message}</small>
                )}
              </div>

              {/* Vendor-specific fields */}
              {vendor_name === "Fragrancex" && (
                <>
                  <div className="flex flex-col">
                    <label className="font-semibold mb-1">API Access ID:</label>
                    <input
                      {...register("apiAccessId")}
                      type="text"
                      placeholder="Enter API Access ID"
                      className={`border border-black rounded p-2 h-[40px] focus:outline-none ${
                        errors.apiAccessId ? "border-red-500" : ""
                      }`}
                    />
                    {errors.apiAccessId && (
                      <small className="text-red-600">
                        {errors.apiAccessId.message}
                      </small>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="font-semibold mb-1">
                      API Access Key:
                    </label>
                    <input
                      {...register("apiAccessKey")}
                      type="text"
                      placeholder="Enter API Access Key"
                      className={`border border-black rounded p-2 h-[40px] focus:outline-none ${
                        errors.apiAccessKey ? "border-red-500" : ""
                      }`}
                    />
                    {errors.apiAccessKey && (
                      <small className="text-red-600">
                        {errors.apiAccessKey.message}
                      </small>
                    )}
                  </div>
                </>
              )}

              {vendor_name === "RSR" && (
                <>
                  <div className="flex flex-col">
                    <label className="font-semibold mb-1">Username:</label>
                    <input
                      {...register("Username")}
                      type="text"
                      placeholder="Enter username"
                      className={`border border-black rounded p-2 h-[40px] focus:outline-none ${
                        errors.Username ? "border-red-500" : ""
                      }`}
                    />
                    {errors.Username && (
                      <small className="text-red-600">
                        {errors.Username.message}
                      </small>
                    )}
                  </div>

                  <div className="flex flex-col relative">
                    <label className="font-semibold mb-1">Password:</label>
                    <input
                      {...register("Password")}
                      type={confirmVisible ? "text" : "password"}
                      placeholder="Enter password"
                      className={`border border-black rounded p-2 h-[40px] focus:outline-none ${
                        errors.Password ? "border-red-500" : ""
                      }`}
                    />
                    <span
                      onClick={() => togglePasswordVisibility("Password")}
                      className="absolute right-3 top-10 cursor-pointer"
                    >
                      {!confirmVisible ? <IoEyeSharp /> : <BsEyeSlashFill />}
                    </span>
                    {errors.Password && (
                      <small className="text-red-600">
                        {errors.Password.message}
                      </small>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="font-semibold mb-1">POS:</label>
                    <input
                      {...register("POS")}
                      type="text"
                      placeholder="Enter POS"
                      className={`border border-black rounded p-2 h-[40px] focus:outline-none ${
                        errors.POS ? "border-red-500" : ""
                      }`}
                    />
                    {errors.POS && (
                      <small className="text-red-600">
                        {errors.POS.message}
                      </small>
                    )}
                  </div>
                </>
              )}

              {!(vendor_name === "RSR" || vendor_name === "Fragrancex") && (
                <>
                  <div className="flex flex-col">
                    <label className="font-semibold mb-1">Host:</label>
                    <input
                      {...register("host")}
                      type="text"
                      placeholder="Enter host"
                      className={`border border-black rounded p-2 h-[40px] focus:outline-none ${
                        errors.host ? "border-red-500" : ""
                      }`}
                    />
                    {errors.host && (
                      <small className="text-red-600">
                        {errors.host.message}
                      </small>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="font-semibold mb-1">FTP Username:</label>
                    <input
                      {...register("ftp_username")}
                      type="text"
                      placeholder="Enter FTP username"
                      className={`border border-black rounded p-2 h-[40px] focus:outline-none ${
                        errors.ftp_username ? "border-red-500" : ""
                      }`}
                    />
                    {errors.ftp_username && (
                      <small className="text-red-600">
                        {errors.ftp_username.message}
                      </small>
                    )}
                  </div>

                  <div className="flex flex-col relative">
                    <label className="font-semibold mb-1">FTP Password:</label>
                    <input
                      {...register("ftp_password")}
                      type={confirmVisible ? "text" : "password"}
                      placeholder="Enter FTP password"
                      className={`border border-black rounded p-2 h-[40px] focus:outline-none ${
                        errors.ftp_password ? "border-red-500" : ""
                      }`}
                    />
                    <span
                      onClick={() => togglePasswordVisibility("ftp_password")}
                      className="absolute right-3 top-10 cursor-pointer"
                    >
                      {!confirmVisible ? <IoEyeSharp /> : <BsEyeSlashFill />}
                    </span>
                    {errors.ftp_password && (
                      <small className="text-red-600">
                        {errors.ftp_password.message}
                      </small>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Buttons */}
            <div className="mt-10 flex justify-center items-center gap-10">
              <button
                onClick={handlePrevious}
                type="button"
                className="border border-[#089451] text-[#089451] w-[100px] hover:bg-[#089451] hover:text-white font-semibold py-2 rounded-[8px] transition"
              >
                Back
              </button>

              <button
                type="submit"
                className="bg-[#027840] text-white hover:bg-white hover:text-[#089451] border border-[#089451] font-semibold py-2 px-4 rounded-[8px] transition-all flex justify-center items-center w-[200px] gap-2"
              >
                {myLoader ? (
                  <ThreeDots height="20" width="20" ariaLabel="loading" />
                ) : (
                  "Next"
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
      <Toaster position="top-right" />
    </>
  );
};

export default Fpicredential;
