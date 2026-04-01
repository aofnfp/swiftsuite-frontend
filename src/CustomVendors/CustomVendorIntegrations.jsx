import React from "react";
import { useSelector } from "react-redux";
import { BsCheckCircleFill } from "react-icons/bs";

import CustomVendorInformation from "./CustomVendorInformation";
import CustomFtpCredentials from "./CustomFtpCredentials";
import CustomApi from "./CustomApi";
import CustomSuccessStep from "./CustomSuccessStep";

const CustomVendorIntegrations = () => {
  const currentStep = useSelector((state) => state.customVendor.currentStep);

  const steps = [
    "Vendor Information",
    "FTP Credentials",
    "Custom Api",
    "Complete",
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <CustomVendorInformation />;
      case 1:
        return <CustomFtpCredentials />;
      case 2:
        return <CustomApi />;
      case 3:
        return <CustomSuccessStep />;
      default:
        return <CustomVendorInformation />;
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center mt-10 pt-10 justify-start w-full max-w-3xl">
        <h1 className="text-xl font-bold py-3">Custom Vendor Integrations</h1>
      </div>

      <div className="flex items-center justify-center gap-6 py-2">
        {steps.map((label, index) => {
          const completed = currentStep > index;
          const current = currentStep === index;

          return (
            <div
              key={index}
              className={`${
                currentStep === 4 ? "hidden" : "block"
              } flex items-center gap-2`}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-white text-sm ${
                  completed
                    ? "bg-[#027840]"
                    : current
                    ? "bg-[#027840]"
                    : "bg-gray-300"
                }`}
              >
                {completed ? (
                  <BsCheckCircleFill className="text-white" />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`text-sm hidden md:block font-medium ${
                  current ? "text-green-800" : "text-gray-600"
                }`}
              >
                {label}
              </span>
              {index !== steps.length - 1 && (
                <div className="w-6 h-px bg-gray-400" />
              )}
            </div>
          );
        })}
      </div>

      <div className="rounded-xl w-full bg-white max-w-3xl min-h-[300px] mb-10 p-5">
        {renderStep()}
      </div>
    </div>
  );
};

export default CustomVendorIntegrations;
