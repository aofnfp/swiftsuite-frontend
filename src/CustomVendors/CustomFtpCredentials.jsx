import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  handleNextStep,
  handlePreviousStep,
  updateFormData,
} from "../redux/customVendorSlice";

const CustomFtpCredentials = () => {
  const dispatch = useDispatch();
  const savedData = useSelector(
    (state) => state.customVendor.formData.customFtpCredentials
  );

  const { register, handleSubmit, formState: { errors } } = useForm({ 
    defaultValues: savedData 
  });

  const onSubmit = (data) => {
    dispatch(updateFormData({ step: "customFtpCredentials", data }));
    dispatch(handleNextStep());
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            FTP Host <span className="text-red-500">*</span>
          </label>
          <input
            {...register("ftp_host", { required: "FTP host is required" })}
            placeholder="Enter host"
            className="w-full border border-gray-300 rounded-lg p-2 bg-[#F9F9F9]"
          />
          {errors.ftp_host && (
            <p className="text-red-500 text-sm mt-1">{errors.ftp_host.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            FTP Username <span className="text-red-500">*</span>
          </label>
          <input
            {...register("ftp_username", { required: "FTP username is required" })}
            placeholder="Enter username"
            className="w-full border border-gray-300 rounded-lg p-2 bg-[#F9F9F9]"
          />
          {errors.ftp_username && (
            <p className="text-red-500 text-sm mt-1">{errors.ftp_username.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            FTP Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            {...register("ftp_password", { required: "FTP password is required" })}
            placeholder="Enter password"
            className="w-full border border-gray-300 rounded-lg p-2 bg-[#F9F9F9]"
          />
          {errors.ftp_password && (
            <p className="text-red-500 text-sm mt-1">{errors.ftp_password.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            FTP Port <span className="text-red-500">*</span>
          </label>
          <input
            {...register("ftp_port", { required: "FTP port is required" })}
            placeholder="Enter port"
            className="w-full border border-gray-300 rounded-lg p-2 bg-[#F9F9F9]"
          />
          {errors.ftp_port && (
            <p className="text-red-500 text-sm mt-1">{errors.ftp_port.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-center gap-4 pt-6">
        <button
          type="button"
          onClick={() => dispatch(handlePreviousStep())}
          className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-100"
        >
          Previous
        </button>
        <button
          type="submit"
          className="bg-[#027840] text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default CustomFtpCredentials;