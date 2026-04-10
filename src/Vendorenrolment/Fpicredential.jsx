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
        vendorName.toLowerCase() === "rsr" || vendorName.toLowerCase() === "fragrancex"
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
      host: "",
      ftp_username: "",
      ftp_password: "",
      Username: "",
      Password: "",
      POS: "",
    },
  });

  const togglePasswordVisibility = (field) => {
    if (field === "ftp_password" || field === "Password") {
      setConfirmVisible(!confirmVisible);
    }
  };

  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    setMyLoader(true);

    const currentAccountData = (() => {
      if ((vendor_name || "").toLowerCase() === "fragrancex") {
        return {
          name: data.name || "",
          apiAccessId: data.apiAccessId || "",
          apiAccessKey: data.apiAccessKey || "",
        };
      }

      if ((vendor_name || "").toLowerCase() === "rsr") {
        return {
          Username: data.Username || "",
          Password: data.Password || "",
          POS: data.POS || "",
        };
      }

      return {
        name: data.name || "",
        ftp_username: data.ftp_username || "",
        ftp_password: data.ftp_password || "",
        host: data.host || "",
      };
    })();

    const credentialPayload = Object.fromEntries(
      Object.entries({
        vendor: vendorId,
        ...currentAccountData,
      }).filter(([, value]) => value !== null && value !== undefined && value !== "")
    );

    const nextFormState = {
      vendor: vendorId,
      vendor_name,
      identifier: store?.identifier || "",
      account_data: currentAccountData,
    };

    try {
      const response = await fpiCredential(credentialPayload);
      setVendorConnection(response.data);
      toast.success("Connection Successful!");
      dispatch(handleNextStep(nextFormState));
      nextStep();
    } catch (error) {
      if (
        error.response?.status === 400 &&
        error.request?.withCredentials === false
      ) {
        toast.error("Invalid credentials!");
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      setMyLoader(false);
    }
  };

  useEffect(() => {
    if ((vendor_name || "").toLowerCase() !== "rsr" && (vendor_name || "").toLowerCase() !== "fragrancex") {
      setValue("host", store?.account_data?.host || "");
      setValue("ftp_username", store?.account_data?.ftp_username || "");
      setValue("ftp_password", store?.account_data?.ftp_password || "");
      setValue("name", store?.account_data?.name || "");
    }

    if ((vendor_name || "").toLowerCase() === "fragrancex") {
      setValue("name", store?.account_data?.name || "");
      setValue("apiAccessId", store?.account_data?.apiAccessId || "");
      setValue("apiAccessKey", store?.account_data?.apiAccessKey || "");
    }

    if ((vendor_name || "").toLowerCase() === "rsr") {
      setValue("Username", store?.account_data?.Username || "");
      setValue("Password", store?.account_data?.Password || "");
      setValue("POS", store?.account_data?.POS || "");
    }
  }, [store, setValue, vendor_name]);

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